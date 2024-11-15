from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv('/home/jupyter/Backend/.env')

def create_app():
    app = Flask(__name__)
    
    # Set JWT secret key (from .env)
    app.config['JWT_SECRET_KEY'] = "shwXy/xIupBsxCMqUKt8IUw/SlbNpms0TfYAflKDZiw="
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # Initialize JWT Manager
    jwt = JWTManager(app)
    
    # JWT error handlers
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        logger.error(f"Invalid token error: {error_string}")
        return jsonify({
            'error': 'Invalid token',
            'message': error_string
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error_string):
        logger.error(f"Missing token error: {error_string}")
        return jsonify({
            'error': 'Authorization header missing',
            'message': error_string
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        logger.error(f"Expired token error. Header: {jwt_header}, Data: {jwt_data}")
        return jsonify({
            'error': 'Token has expired',
            'message': 'Please log in again'
        }), 401
        
    @jwt.token_verification_failed_loader
    def verification_failed_callback(jwt_header, jwt_data):
        logger.error(f"Token verification failed. Header: {jwt_header}, Data: {jwt_data}")
        return jsonify({
            'error': 'Token verification failed',
            'message': 'Invalid token signature'
        }), 401

    # Optional: Add a request logger middleware
    @app.before_request
    def log_request_info():
        logger.debug('Headers: %s', dict(request.headers))
        # Only log body for specific content types
        if request.is_json:
            logger.debug('Body: %s', request.get_json())

    # Enable CORS
    CORS(app)
    
    # Register blueprints
    from app.routes.auth_routes import bp as auth_bp
    from app.routes.browse_routes import bp as browse_bp
    from app.routes.chatbot_routes import bp as chatbot_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(browse_bp)
    app.register_blueprint(chatbot_bp)
    
    return app
