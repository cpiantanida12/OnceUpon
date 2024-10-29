from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from firebase_admin import auth
from app.services.firestore_service import verify_user, add_user

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Login route - generates a JWT upon successful authentication
@bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = verify_user(email, password)  # Verifies user in Firestore
    if user:
        access_token = create_access_token(identity=user['id'])  # JWT token creation
        return jsonify({"token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate input data
    if not email or not password:
        return jsonify({"error": "Email, password, and name are required"}), 400

    try:
        # Create user in Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password
        )

        # Add user information to Firestore
        add_user(user.uid, email)

        return jsonify({"message": "User created successfully", "user_id": user.uid}), 201

    except Exception as e:
        print("Error creating user:", e)
        return jsonify({"error": "Failed to create user"}), 500