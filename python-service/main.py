import logging
from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound

# Configure Logging
logging.basicConfig(level=logging.INFO)

# Flask app setup
app = Flask(__name__)

def fetch_youtube_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = transcript_list.find_generated_transcript(['en'])
        logging.warning(f"{transcript.fetch()}")
        return transcript.fetch()
    except NoTranscriptFound:
        logging.warning(f"No transcript found for video: {video_id}")
        return None

# RESTful API endpoints
@app.route('/chat', methods=['POST'])
def chat_with_video_content():
    content = request.json
    video_id = content.get("video_id")
    user_query = content.get("message")

    if not video_id or not user_query:
        return jsonify({"error": "Missing video ID or message"}), 400

    # transcript = retrieve_transcript_from_db(video_id)
    transcript = get_transcript(video_id)['transcript']
    if transcript is None:
        return jsonify({"error": "Transcript not found"}), 404

    llm_response = query_mistral_llm(transcript, user_query)
    return jsonify({"response": llm_response})

def query_mistral_llm(transcript, user_query):
    prompt = "Context: You are a video chat bot and video guide for users and answer anything about the video to the best of your knowledge. You will be provided the transcript and a question from the user of the video. Transcript: " + transcript + "Question: " + user_query;
    payload = { "model": "mistral", "prompt": prompt, "stream": False }
    response = requests.post("http://localhost:11434/api/generate", json=payload)
    return response.text

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
