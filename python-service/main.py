import logging
import json
import threading
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import requests
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound

# Configure Logging
logging.basicConfig(level=logging.INFO)

# Flask and SocketIO setup
app = Flask(__name__)
socketio = SocketIO(app)

def fetch_youtube_transcript(video_id):
    """
    Fetches the transcript for a given YouTube video ID.

    Args:
        video_id (str): The YouTube video ID.

    Returns:
        dict or None: The transcript data if found, otherwise None.
    """
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = transcript_list.find_generated_transcript(['en'])
        logging.info(f"Transcript fetched for video: {video_id}")
        return transcript.fetch()
    except NoTranscriptFound:
        logging.warning(f"No transcript found for video: {video_id}")
        return None

@app.route('/')
def index():
    return "Flask-SocketIO Server is running!"

@app.route('/start_chat', methods=['POST'])
def start_chat():
    """
    Endpoint to start a chat with video content. Expects a JSON payload with 'video_id'.

    Returns:
        Flask Response: JSON response indicating chat initialization status.
    """
    content = request.json
    video_id = content.get("video_id")

    if not video_id:
        return jsonify({"error": "Missing video ID"}), 400

    transcript = fetch_youtube_transcript(video_id)
    if transcript is None:
        return jsonify({"error": "Transcript not found"}), 404

    # Store the transcript in the session or pass it to the client to send with each message
    # This is a placeholder, adapt according to your application's architecture
    # You might want to send it back to the client or store it in a session or database

    return jsonify({"message": "Chat initialized", "transcript": transcript})

def query_mistral_llm(transcript, user_query, sid):
    """
    Queries the Mistral LLM with the transcript and user query, streaming the response via WebSocket.

    Args:
        transcript (list): The video transcript.
        user_query (str): The user's query.
        sid (str): The SocketIO session ID.
    """
    transcript_str = ' '.join([segment['text'] for segment in transcript])
    prompt = ("Context: You are a video chat bot and video guide for users. "
              "Answer anything about the video to the best of your knowledge. "
              "Transcript: " + transcript_str + " Question: " + user_query)
    payload = {"model": "mistral", "prompt": prompt, "stream": True}

    try:
        response = requests.post("http://127.0.0.1:11434/api/generate", json=payload, stream=True)
        response.raise_for_status()
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                json_data = json.loads(decoded_line)
                socketio.emit('llm_response', {'data': json_data}, room=sid)
                if json_data.get("done"):
                    break
    except requests.RequestException as e:
        logging.error(f"Error querying Mistral LLM: {e}")
        socketio.emit('llm_response', {'error': "An error occurred.", 'done': True}, room=sid)

@socketio.on('send_message')
def handle_send_message(message):
    """
    WebSocket event to handle incoming messages from the client.

    Args:
        message (dict): The message from the client containing the user query and transcript.
    """
    sid = request.sid
    user_query = message['query']
    transcript = message['transcript']  # Assuming the transcript is sent with each message
    threading.Thread(target=query_mistral_llm, args=(transcript, user_query, sid)).start()

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)

