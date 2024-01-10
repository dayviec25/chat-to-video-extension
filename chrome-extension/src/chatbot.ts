// chatbot.ts

// Replace with the WebSocket URL for your chat endpoint
const SOCKET_ENDPOINT: string =
  "wss://dchung.dev/socket.io/?EIO=3&transport=websocket";

let socket: WebSocket | null = null;

window.onload = (): void => {
  socket = new WebSocket(SOCKET_ENDPOINT);

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.llm_response) {
      displayResponse(data.llm_response.data.response);
      if (data.llm_response.data.done) {
        console.log("Chat completed");
      }
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  const submitButton = document.getElementById("submitQuery");
  if (submitButton) {
    submitButton.addEventListener("click", submitQuery);
  }
};

const getVideoIdFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v") || "";
};

const submitQuery = async (): Promise<void> => {
  const videoId: string = getVideoIdFromUrl();

  if (!videoId) {
    displayResponse("Invalid YouTube URL.");
    return;
  }

  const userQueryInput = document.getElementById(
    "userQuery",
  ) as HTMLInputElement | null;
  const userQuery = userQueryInput ? userQueryInput.value : "";

  if (userQuery && socket) {
    socket.send(JSON.stringify({ query: userQuery, video_id: videoId }));
  } else {
    displayResponse("Please enter a query.");
  }
};

const displayResponse = (message: string): void => {
  const responseDiv = document.getElementById("response");
  if (responseDiv) {
    responseDiv.textContent = message;
  }
};

// Optional: Close the WebSocket connection when the window is closed/unloaded
window.onunload = (): void => {
  if (socket) {
    socket.close();
  }
};
