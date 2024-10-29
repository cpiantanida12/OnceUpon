from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import google.generativeai as genai

# import vertexai
# from vertexai.preview.generative_models import GenerativeModel, ChatSession, Part
# import vertexai.preview.generative_models as generative_models
# import re
# from transformers import pipeline

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['onceupon']
collection = db['users']

genai.configure(api_key='AIzaSyDHNwRBRBysSj2UMd2gPfbLOVKxk0EHa3k')
model = genai.GenerativeModel('gemini-1.5-pro')

@app.route('/test-gemini', methods=['POST'])
def generate_from_gemini():
    data = request.get_json()
    prompt = data.get('prompt')
    response = model.generate_content(prompt)
    return jsonify({"text": response.text})

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

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    data = request.get_json()
    user_input = data.get('input')

    if not user_input:
        return jsonify({"error": "Input is required"}), 400

    # Placeholder summary generation logic (replace with real logic)
    summary = f"A thrilling story about {user_input} with unexpected twists and turns."

    return jsonify({"summary": summary}), 200

if __name__ == '__main__':
    app.run(debug=True)
