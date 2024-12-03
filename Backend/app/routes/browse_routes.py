from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.firestore_service import db

bp = Blueprint('browse', __name__, url_prefix='/browse')

@bp.route('/get-preferences', methods=['POST'])
@jwt_required()
def get_preferences():
    print("Get preferences route accessed")
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        user_doc = db.collection('users').document(email).get()
        
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404
            
        user_data = user_doc.to_dict()
        themes = user_data.get('themes', [])
        
        return jsonify({
            "themes": themes
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500