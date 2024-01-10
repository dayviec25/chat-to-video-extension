import logging
import requests
from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound

# Configure Logging
logging.basicConfig(level=logging.INFO)

# Flask app setup
app = Flask(__name__)

def fetch_youtube_transcript(video_id):
    """
    Fetches the transcript for a given YouTube video ID.

    Args:
        video_id (str): The ID of the YouTube video.

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

@app.route('/chat', methods=['POST'])
def chat_with_video_content():
    """
    Endpoint to chat with video content. Expects a JSON payload with 'video_id' and 'message'.

    Returns:
        Flask Response: JSON response with the result or error message.
    """
    content = request.json
    video_id = content.get("video_id")
    user_query = content.get("message")

    if not video_id or not user_query:
        return jsonify({"error": "Missing video ID or message"}), 400

    transcript = fetch_youtube_transcript(video_id)
    if transcript is None:
        return jsonify({"error": "Transcript not found"}), 404

    llm_response = query_mistral_llm(transcript, user_query)
    return jsonify({"response": llm_response})

def query_mistral_llm(transcript, user_query):
    """
    Queries the Mistral LLM with the transcript and user query.

    Args:
        transcript (list): The video transcript.
        user_query (str): The user's query.

    Returns:
        str: The response from the LLM.
    """
    # Convert the transcript list to a string
    transcript_str = ' '.join([segment['text'] for segment in transcript])

    prompt = ("Context: You are a video chat bot and video guide for users. "
              "Answer anything about the video to the best of your knowledge. "
              "Transcript: " + transcript_str + " Question: " + user_query)
    payload = {"model": "mistral", "prompt": prompt, "stream": False}

    try:
        response = requests.post("http://172.17.0.1:11434/api/generate", json=payload)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        logging.error(f"Error querying Mistral LLM: {e}")
        return "An error occurred while processing the request."

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
