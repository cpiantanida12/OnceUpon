from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import redis
from app.services.chatbot_service import generate_summary, generate_modified_summary, generate_chapter, extract_characters, generate_story_in_chapters
from app.services.firestore_service import get_user_age

bp = Blueprint('chatbot', __name__, url_prefix='/chatbot')

# Connect to Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@bp.route('/message', methods=['POST'])
@jwt_required()
def chatbot_message():
    user_id = request.json.get('email')
    user_message = request.json.get('message')
    user_age = get_user_age(user_id)
    if user_age <= 4:
        user_age = 4

    # Retrieve the chat history from Redis
    prev_summary = redis_client.get(f"prev_summary:{user_id}")
    prev_summary = json.loads(prev_summary) if prev_summary else []
    chat_history = redis_client.get(f"chat_history:{user_id}")
    chat_history = json.loads(chat_history) if chat_history else []

    # Generate response and update history
    if not prev_summary:
        response_message = generate_summary(user_message, user_age)
    else:
        response_message = generate_modified_summary(user_message, user_age, prev_summary, chat_history)
        
    response_message_to_user = f"How does this story sound: \n\n{response_message}\n\n If you like it then press the start reading button. If not, then let me know how I can make it better or press the clear button to start over!
    
    chat_history.append({"user": user_message, "bot": response_message})

    # Save updated history back to Redis
    redis_client.set(f"chat_history:{user_id}", json.dumps(chat_history))

    return jsonify({"response": response_message_to_user}), 200
