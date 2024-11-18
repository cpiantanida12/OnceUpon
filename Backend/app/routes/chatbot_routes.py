from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
import re
from app.services.chatbot_service import (
    start_story,
    modify_summary,
    generate_chapter_api,
    continue_story,
    session_data,
    clear_session
)
from app.services.firestore_service import get_user_age, save_story
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
        
        # Get user age (default to 4 if not found or too young)
        user_age = get_user_age(user_id)
        if user_age is None or user_age < 4:
            user_age = 4
        print(f"User age for {user_id}: {user_age}")
        
        try:
            # Check if user has an existing session with a summary
            if user_id in session_data and "summary" in session_data[user_id]:
                response_message = modify_summary(user_id, user_message)
            else:
                # Start a new story if no existing summary
                response_message = start_story(user_message, user_id, user_age)
                # Initialize session data
                if user_id not in session_data:
                    session_data[user_id] = {}
                session_data[user_id]["summary"] = response_message
            
            # Format response for user
            intro = re.search(r"##\s*Intro.*?:\s*(.*?)\s*##", response_message, re.DOTALL | re.IGNORECASE)
            extract_intro = intro.group(1).strip() if intro else response_message
                
            response_message_to_user = (
                f"How does this story sound?:\n\n{extract_intro}\n\n"
                "If you like it, press the 'Start Reading' button. "
                "If not, let me know how I can make it better or press 'Clear' to start over!"
            )
            
            return jsonify({
                "response": response_message_to_user,
                "has_story": True,
            }), 200
            
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            return jsonify({
                "error": "Error processing message",
                "details": str(e)
            }), 500
            
    except Exception as e:
        print(f"Detailed error in chatbot_message: {str(e)}")
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500

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
        
        if user_id not in session_data or "summary" not in session_data[user_id]:
            return jsonify({"error": "No story summary found"}), 400
        
        # Get final approved summary
        prev_summary = session_data[user_id]["summary"]
        
        # Get user age for appropriate content generation
        user_age = get_user_age(user_id)
        if user_age is None or user_age < 4:
            user_age = 4
        
        generated_chapters = []
        
        try:
            # Generate all three chapters
            for chapter_number in range(1, 4):
                chapter = generate_chapter_api(user_id, chapter_number)
                generated_chapters.append(chapter)
            
            chapter_dict = {
                f"chapter{i+1}": chapter 
                for i, chapter in enumerate(generated_chapters)
            }
            
            # Extract title from summary
            title = re.search(r"##\s*Title\s*:\s*(.*?)\s*##", prev_summary, re.DOTALL | re.IGNORECASE)
            extracted_title = title.group(1).strip() if title else "Untitled Story"
            
            save_result = save_story(user_id, extracted_title, chapter_dict)
            if isinstance(save_result, dict) and "error" in save_result:
                return jsonify(save_result), 500
            
            # Clean up conversation state after successful story generation
            clear_session(user_id)
            
            return jsonify({
                "message": "Story generated successfully",
                "story_id": save_result.get("story_id", ""),  # Ensure story_id is included
                "title": extracted_title,
                "chapters": {  # Frontend expects this exact structure
                    "chapter1": chapter_dict["chapter1"],
                    "chapter2": chapter_dict["chapter2"],
                    "chapter3": chapter_dict["chapter3"]
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                "error": "Error generating full story",
                "details": str(e)
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500

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
        
        # Clear conversation state
        clear_session(user_id)
        
        return jsonify({
            "message": "Conversation cleared successfully",
            "has_story": False
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Error clearing conversation",
            "details": str(e)
        }), 500

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
