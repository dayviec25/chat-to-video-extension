// chatbot.ts

// Add the appropriate URL for your chat endpoint
const CHAT_ENDPOINT: string = "143.198.107.137:5000/chat";

window.onload = (): void => {
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

  if (userQuery) {
    try {
      const response: Response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_id: videoId, message: userQuery }),
      });

      const data: any = await response.json();

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
};

const displayResponse = (message: string): void => {
  const responseDiv = document.getElementById("response");
  if (responseDiv) {
    responseDiv.textContent = message;
  }
};
