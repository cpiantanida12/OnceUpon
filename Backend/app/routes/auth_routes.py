from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.firestore_service import verify_user, register_user, append_survey_to_user

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Login route - generates a JWT upon successful authentication
@bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = verify_user(email, password)  # Verifies user in Firestore
    if user:
        # Use email as identity in the token since it’s unique
        access_token = create_access_token(identity=email)  
        return jsonify({"token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    f_name = data.get('f_name')
    l_name = data.get('l_name')
    DOB = data.get('date_of_birth')

    # Validate input data
    if not email or not password or not f_name or not l_name or not DOB:
        return jsonify({"error": "Email, password, first name, last name, and date of birth are required"}), 400

    try:
        register_user(email, password, f_name, l_name, DOB)
        return jsonify({"message": "User created successfully", "user_id": email}), 201

    except Exception as e:
        print("Error creating user:", e)
        return jsonify({"error": "Failed to create user"}), 500
    
@bp.route('/survey', methods=['POST'])
def survey():
    data = request.get_json()
    email = data.get('email')
    themes = data.get('themes', [])
    hobbies = data.get('hobbies', [])

    # Validate input data
    if not email:
        return jsonify({"error": "Email is required"}), 400

    result = append_survey_to_user(email, themes, hobbies)
    
    if "success" in result:
        return jsonify(result), 200
    else:
        return jsonify(result), 400