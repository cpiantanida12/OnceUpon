from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    
    CORS(app)
    
    # Set JWT secret key
    app.config['JWT_SECRET_KEY'] = "shwXy/xIupBsxCMqUKt8IUw/SlbNpms0TfYAflKDZiw="
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # Initialize JWT Manager
    jwt = JWTManager(app)
    
    # Your existing code...
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        logger.error(f"Invalid token error: {error_string}")
        return jsonify({
            'error': 'Invalid token',
            'message': error_string,
            'status': 'invalid_token'
        }), 403

    @jwt.unauthorized_loader
    def missing_token_callback(error_string):
        logger.error(f"Missing token error: {error_string}")
        return jsonify({
            'error': 'Authorization header missing',
            'message': error_string,
            'status': 'missing_token'
        }), 403

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        logger.error(f"Expired token error. Header: {jwt_header}, Data: {jwt_data}")
        return jsonify({
            'error': 'Token has expired',
            'message': 'Please log in again',
            'status': 'token_expired'
        }), 403

    # Register blueprints
    from app.routes.auth_routes import bp as auth_bp
    from app.routes.browse_routes import bp as browse_bp
    from app.routes.chatbot_routes import bp as chatbot_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(browse_bp)
    app.register_blueprint(chatbot_bp)
    
    return app
