from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv('/home/jupyter/Backend/.env')

def create_app():
    app = Flask(__name__)

    # Set JWT secret key (from .env)
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    # Initialize JWT Manager
    jwt = JWTManager(app)

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
