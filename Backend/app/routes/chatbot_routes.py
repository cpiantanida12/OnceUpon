from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from datetime import datetime
import re
from app.services.chatbot_service import (
    generate_summary, generate_modified_summary, generate_story_in_chapters
)
from app.services.firestore_service import (
    get_conversation_state, save_conversation_state, clear_conversation,
    save_story, get_user_age
)
from google.cloud import texttospeech
import io

bp = Blueprint('chatbot', __name__, url_prefix='/chatbot')

@bp.route('/message', methods=['POST'])
@jwt_required()
def chatbot_message():
    """
    Handle chat messages and story modifications.
    Generates initial story summary or modifies existing story based on user feedback.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        user_id = data.get('email')
        user_message = data.get('message')

        if not user_id or not user_message:
            return jsonify({"error": "Missing email or message"}), 400

        user_age = get_user_age(user_id)
        if user_age is None or user_age < 4:
            user_age = 4

        prev_summary, chat_history = get_conversation_state(user_id)

        if not prev_summary:
            response_message = generate_summary(user_message, user_age)
            message_type = "initial_story"
        else:
            response_message = generate_modified_summary(user_message, user_age, prev_summary, chat_history)
            message_type = "story_modification"

        match = re.search(r":\s*(.*?)\s*##", response_message, re.DOTALL)
        extract_intro = match.group(1).strip() if match else response_message
        extract_intro = "\n".join([line.strip() for line in extract_intro.splitlines()])

        response_message_to_user = (
            f"How does this story sound:\n\n{extract_intro}\n\n"
            "If you like it, press the 'Start Reading' button. "
            "If not, let me know how I can make it better or press 'Clear' to start over!"
        )

        chat_history.append({
            "user": user_message,
            "bot": response_message,
            "type": message_type,
            "timestamp": datetime.utcnow().isoformat()
        })

        save_result = save_conversation_state(user_id, response_message, chat_history)
        if "error" in save_result:
            return jsonify({"error": save_result["error"]}), 500

        return jsonify({
            "response": response_message_to_user,
            "has_story": True,
            "message_type": message_type
        }), 200

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

@bp.route('/generate-story', methods=['POST'])
@jwt_required()
def generate_full_story():
    """
    Generate the complete story when user is satisfied with the summary.
    Creates three chapters based on the approved story summary.
    """
    try:
        data = request.get_json()
        user_id = data.get('email')
        if not user_id:
            return jsonify({"error": "Missing user ID"}), 400

        prev_summary, chat_history = get_conversation_state(user_id)
        if not prev_summary:
            return jsonify({"error": "No story summary found"}), 404

        user_age = get_user_age(user_id)
        if user_age is None or user_age < 4:
            user_age = 4

        chapter1, chapter2, chapter3 = generate_story_in_chapters(prev_summary, user_age)

        chapters = {"chapter1": chapter1, "chapter2": chapter2, "chapter3": chapter3}

        save_result = save_story(user_id, chapters, prev_summary)
        if "error" in save_result:
            return jsonify(save_result), 500

        clear_result = clear_conversation(user_id)
        if "error" in clear_result:
            print(f"Warning: Failed to clear conversation: {clear_result['error']}")

        return jsonify({
            "message": "Story generated successfully",
            "story_id": save_result["story_id"],
            "chapters": chapters,
            "summary": prev_summary
        }), 200

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

@bp.route('/clear', methods=['POST'])
@jwt_required()
def clear_chat():
    """
    Clear the current conversation state and start over.
    """
    try:
        data = request.get_json()
        user_id = data.get('email')
        if not user_id:
            return jsonify({"error": "Missing user ID"}), 400

        clear_result = clear_conversation(user_id)
        if "error" in clear_result:
            return jsonify(clear_result), 500

        return jsonify({"message": "Conversation cleared successfully", "has_story": False}), 200

    except Exception as e:
        return jsonify({"error": "Error clearing conversation", "details": str(e)}), 500

@bp.route('/read-story', methods=['POST'])
@jwt_required()
def read_story():
    try:
        data = request.get_json()
        user_id = data.get('email')
        if not user_id:
            return jsonify({"error": "Missing user ID"}), 400

        story_text = data.get('story')
        if not story_text:
            return jsonify({"error": "Missing story"}), 400

        client = texttospeech.TextToSpeechClient()
        input_text = texttospeech.SynthesisInput(text=story_text)
        voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Studio-O")
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, speaking_rate=1)
        response = client.synthesize_speech(request={"input": input_text, "voice": voice, "audio_config": audio_config})

        return send_file(io.BytesIO(response.audio_content), as_attachment=True, mimetype="audio/mpeg", download_name="output.mp3")

    except Exception as e:
        return jsonify({"error": "Error generating audio", "details": str(e)}), 500

@bp.errorhandler(Exception)
def handle_error(e):
    return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
