from google.cloud import firestore
from firebase_admin import auth

db = firestore.Client()

# Verify user credentials in Firestore
def add_user(user_data):
    user_data = {
        'email': email,
        'name': name,
        'created_at': firestore.SERVER_TIMESTAMP
    }
    db.collection('users').document(user_id).set(user_data)

def verify_user(email, password):
    users_ref = db.collection('users').where('email', '==', email).where('password', '==', password)
    docs = users_ref.stream()

    for doc in docs:
        return doc.to_dict()
    return None

# Fetch all products from Firestore
def get_products():
    products_ref = db.collection('products')
    return [doc.to_dict() for doc in products_ref.stream()]

# Add a new product to Firestore
def add_product(product_data):
    new_product_ref = db.collection('products').document()
    new_product_ref.set(product_data)
    return new_product_ref.get().to_dict()

# Log chatbot interactions to Firestore
def save_chatbot_interaction(user_id, message, response):
    interaction_ref = db.collection('chatbot_logs').document(user_id)
    interaction_ref.set({
        'user_id': user_id,
        'message': message,
        'response': response
    }, merge=True)
