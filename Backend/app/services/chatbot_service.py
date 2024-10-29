import requests
import os

# Send message to Google Gemini API and get a response
def send_message_to_gemini(user_message, history):
    # Get the API endpoint and key from environment variables
    gemini_api_url = os.getenv('GEMINI_API_URL')
    api_key = os.getenv('GEMINI_API_KEY')

    # Set up the request headers with the API key
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Prepare the request data
    data = {"history": history, "message": user_message}

    # Send the request to Google Gemini
    try:
        response = requests.post(gemini_api_url, json=data, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes

        # Extract the chatbot's reply from the response JSON
        return response.json().get("reply", "I'm sorry, I didn’t understand that.")
    
    except requests.RequestException as e:
        print(f"Error communicating with Google Gemini: {e}")
        return "Error communicating with chatbot."