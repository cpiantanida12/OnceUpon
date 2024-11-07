from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['onceupon']
collection = db['users']

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

genai.configure(api_key='AIzaSyDHNwRBRBysSj2UMd2gPfbLOVKxk0EHa3k')
model = genai.GenerativeModel('gemini-1.5-pro', generation_config=generation_config)

@app.route('/test-gemini', methods=['POST'])
def generate_from_gemini():
    data = request.get_json()
    userInput = data.get('userInput')
    prompt = f"You will be generating a story of 3 chapters with total narration time of 15 minutes. Give me a summary with brief descriptions for each of the three chapters of this story that is engaging for a 6-year-old. The story prompt - {userInput}. Note: You will be using this chapter-wise to generate the actual chapters later on. To ensure the chapters are long enough, give enough information and detail in the summary that can be built up on during story generation. Each chapter's summary should be in a paragraph format."
    response = get_chat_response(prompt)
    return jsonify({"text": response})

def get_chat_response(userInput: str) -> str:
    text_response = []
    responses = model.generate_content(userInput)
    for chunk in responses:
        cleaned_text = chunk.text.replace('*', ' ').replace('#', ' ')
        text_response.append(cleaned_text)
    return "".join(text_response)

@app.route('/modify-summary', methods=['POST'])
def modify_summary():
    data = request.get_json()
    userModifications = data.get('userModifications')
    existingSummary = data.get('existingSummary')
    prompt = f"You will modify a given story summary - {existingSummary} with the following changes requested by the user - {userModifications}. Return in the same format as the provided summary."
    response = get_chat_response(prompt)
    return jsonify({"text": response})

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    data = request.get_json()
    userInput = data.get('userInput')
    prompt = f"You will be generating a story of 3 chapters with total narration time of 20 minutes. Give me a summary with brief descriptions for each of the three chapters of this story that is engaging for a child. Also, list important characters with descriptions. The story prompt - {userInput}. Note: You will be using this chapter-wise to generate the actual chapters later on. To ensure the chapters are long enough, give enough information and detail in the summary that can be built up on during story generation. Each chapter's summary should be in paragraph format."
    response = get_chat_response(prompt)
    return jsonify({"text": response})

@app.route('/generate-story', methods=['POST'])
def generate_story():
    data = request.get_json()
    output_from_prompt2 = data.get('userInput')
    prompt = f"You will be generating an interesting and unique children’s story of 3 chapters with total narration time of 20 minutes and from 6000 to 8000 tokens. This story should be based on the detailed summary and character descriptions provided. The detailed summary - {output_from_prompt2}. Note: The story should be in paragraph format. Stick to the outline of the story and be consistent with characters and storyline throughout. The story MUST be in English entirely."
    response = get_chat_response(prompt)
    return jsonify({"text": response})

@app.route('/generate-custom-title', methods=['POST'])
def generate_custom_title():
    data = request.get_json()
    userSummary = data.get('userSummary')
    prompt = f"You will create a story title based on the following summary - {userSummary}. Return as a single string."
    response = get_chat_response(prompt)
    return jsonify({"text": response})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    user_ip = request.remote_addr

    user_id = collection.insert_one({
        "email": email,
        "password": hashed_password,
        "last_login_ip": user_ip,
        "signup_date": datetime.utcnow()
    }).inserted_id

    return jsonify({"message": "User created", "_id": str(user_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = collection.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        user_ip = request.remote_addr
        collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login_ip": user_ip}}
        )
        return jsonify({"message": "Login successful", "user_id": str(user['_id'])}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/create', methods=['POST'])
def create():
    data = request.json
    result = collection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)})

@app.route('/read', methods=['GET'])
def read_all():
    documents = collection.find()
    result = []
    for doc in documents:
        doc['_id'] = str(doc['_id'])
        result.append(doc)
    return jsonify(result)

@app.route('/read/<id>', methods=['GET'])
def read_one(id):
    document = collection.find_one({"_id": ObjectId(id)})
    if document:
        document['_id'] = str(document['_id'])
        return jsonify(document)
    else:
        return jsonify({"error": "Document not found"}), 404

@app.route('/update/<id>', methods=['PUT'])
def update(id):
    data = request.json
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count > 0:
        return jsonify({"message": "Document updated"})
    else:
        return jsonify({"error": "Document not found"}), 404

@app.route('/delete/<id>', methods=['DELETE'])
def delete(id):
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Document deleted"})
    else:
        return jsonify({"error": "Document not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
