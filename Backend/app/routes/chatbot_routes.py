from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import redis
from app.services.chatbot_service import send_message_to_gemini

bp = Blueprint('chatbot', __name__, url_prefix='/chatbot')

# Connect to Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@bp.route('/message', methods=['POST'])
@jwt_required()
def chatbot_message():
    user_id = request.json.get('user_id')
    user_message = request.json.get('message')

    # Retrieve the chat history from Redis
    chat_history = redis_client.get(f"chat_history:{user_id}")
    chat_history = json.loads(chat_history) if chat_history else []

    # Generate response and update history
    response_message = send_message_to_gemini(user_message, chat_history)
    chat_history.append({"user": user_message, "bot": response_message})

    # Save updated history back to Redis
    redis_client.set(f"chat_history:{user_id}", json.dumps(chat_history))

    return jsonify({"response": response_message}), 200
