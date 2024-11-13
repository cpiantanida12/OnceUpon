from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
#from app.services.firestore_service import get_browse

bp = Blueprint('browse', __name__, url_prefix='/browse')

# Get all browse (JWT required)
@bp.route('/', methods=['GET'])
@jwt_required()
def list_browse():
    browse = get_browse()
    return jsonify(browse), 200

