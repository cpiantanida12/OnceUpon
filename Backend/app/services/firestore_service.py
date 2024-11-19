import firebase_admin
from firebase_admin import firestore
import bcrypt
from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import Optional, Dict, List, Any, Tuple

# Initialize Firebase app only if it hasn't been initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.Client(project='adsp-capstone-once-upon', database='onceupon')

def register_user(email, password, f_name, l_name, DOB):
    # Hash the password with bcrypt
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Convert DOB from milliseconds to a Firestore timestamp
    dob_datetime = datetime.fromtimestamp(DOB / 1000)  # Convert ms to seconds
    
    user_data = {
        'email': email,
        'password': hashed_password.decode('utf-8'),  # Store hashed password as a string
        'f_name': f_name,
        'l_name': l_name,
        'date_of_birth': dob_datetime,
        'created_at': firestore.SERVER_TIMESTAMP
    }
    
    # Use email as the document ID
    db.collection('users').document(email).set(user_data)

def verify_user(email, password):
    # Retrieve the user document by email
    user_doc = db.collection('users').document(email).get()
    if user_doc.exists:
        user_data = user_doc.to_dict()
        stored_password = user_data['password'].encode('utf-8')
        
        # Verify the password with bcrypt
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return user_data  # Return user data if login is successful
        else:
            print("Invalid password")
            return None
    else:
        print("User does not exist")
        return None
    
def append_survey_to_user(user_id, themes, hobbies):
    # Reference to the user document with email as the document ID
    user_doc_ref = db.collection('users').document(user_id)

    try:
        # Check if the document exists
        doc = user_doc_ref.get()
        if not doc.exists:
            return {"error": "User document does not exist."}

        # Append the survey data
        user_doc_ref.update({
            'themes': firestore.ArrayUnion(themes),
            'hobbies': firestore.ArrayUnion(hobbies)
        })

        return {"success": True, "message": "Survey data added successfully."}
    except Exception as e:
        print(f"Error updating user document: {e}")
        return {"error": str(e)}
    
def get_user_age(user_id):
    try:
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            return None
            
        user_data = user_doc.to_dict()
        if 'date_of_birth' not in user_data:
            return None
            
        dob_timestamp = user_data['date_of_birth']
        
        # Convert Firebase timestamp to datetime
        if isinstance(dob_timestamp, datetime):
            dob = dob_timestamp
        else:
            dob = datetime.fromtimestamp(dob_timestamp.seconds + dob_timestamp.nanos/1e9)
            
        today = datetime.now()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        
        return age
        
    except Exception as e:
        print(f"Error calculating age: {str(e)}")
        return None

    # Conversation Services
def get_conversation_state(user_id: str) -> Tuple[Optional[str], List[Dict[str, Any]]]:
    """Retrieve conversation state from Firestore"""
    try:
        conv_doc = db.collection('conversations').document(user_id).get()
        if not conv_doc.exists:
            return None, []
            
        data = conv_doc.to_dict()
        return data.get('prev_summary'), data.get('chat_history', [])
        
    except Exception as e:
        print(f"Error retrieving conversation: {str(e)}")
        return None, []

def save_conversation_state(user_id: str, prev_summary: str, chat_history: List[Dict[str, Any]]):
    """Save conversation state to Firestore"""
    try:
        db.collection('conversations').document(user_id).set({
            'prev_summary': prev_summary,
            'chat_history': chat_history,
            'updated_at': datetime.utcnow(),
            'user_id': user_id
        })
        return {"success": True}
    except Exception as e:
        return {"error": f"Error saving conversation: {str(e)}"}

def clear_conversation(user_id: str) -> Dict[str, Any]:
    """Clear user's conversation state"""
    try:
        db.collection('conversations').document(user_id).delete()
        return {"success": True}
    except Exception as e:
        return {"error": f"Error clearing conversation: {str(e)}"}

# Story Services
def save_story(user_id: str, title: str, summary: str, chapters: Dict[str, str]) -> Dict[str, Any]:
    """Save completed story to Firestore"""
    try:
        story_ref = db.collection('user_activity').document()
        story_ref.set({
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'title': title,
            'summary': summary,
            'chapters': chapters,
            'activity': 'generated_story'
        })
        return {"success": True, "story_id": story_ref.id}
    except Exception as e:
        return {"error": f"Error saving story: {str(e)}"}

def get_user_stories(user_id: str) -> List[Dict[str, Any]]:
    """Retrieve all stories for a user"""
    try:
        stories = db.collection('stories').where('user_id', '==', user_id).stream()
        return [story.to_dict() for story in stories]
    except Exception as e:
        print(f"Error retrieving stories: {str(e)}")
        return []

# Cleanup Service
def cleanup_old_conversations(hours: int = 24):
    """Delete conversations older than specified hours"""
    try:
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        old_convs = db.collection('conversations')\
            .where('updated_at', '<', cutoff)\
            .stream()
        
        for conv in old_convs:
            conv.reference.delete()
            
        return {"success": True}
    except Exception as e:
        return {"error": f"Error cleaning up conversations: {str(e)}"}
