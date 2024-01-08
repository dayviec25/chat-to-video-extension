// chatbot.ts

// Add the appropriate URL for your chat endpoint
const CHAT_ENDPOINT = "http://localhost:5000/chat";

window.onload = () => {
  document
    .getElementById("submitQuery")!
    .addEventListener("click", submitQuery);
};

async function submitQuery() {
  const userQuery = (document.getElementById("userQuery") as HTMLInputElement)
    .value;
  const videoId = "sampleVideoId"; // Replace with actual video ID or retrieve dynamically

  if (userQuery) {
    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_id: videoId, message: userQuery }),
      });

      const data = await response.json();

      if (response.ok) {
        displayResponse(data.response);
      } else {
        displayResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      displayResponse("An error occurred while fetching the response.");
    }
  } else {
    displayResponse("Please enter a query.");
  }
}

function displayResponse(message: string) {
  const responseDiv = document.getElementById("response")!;
  responseDiv.textContent = message;
}
