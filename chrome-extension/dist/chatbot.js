"use strict";
// chatbot.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Add the appropriate URL for your chat endpoint
const CHAT_ENDPOINT = "http://localhost:5000/chat";
window.onload = () => {
    const submitButton = document.getElementById("submitQuery");
    if (submitButton) {
        submitButton.addEventListener("click", submitQuery);
    }
};
const submitQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    const userInput = document.getElementById("userQuery");
    const userQuery = userInput ? userInput.value : "";
    const videoId = "sampleVideoId"; // Replace with actual video ID or retrieve dynamically
    if (userQuery) {
        try {
            const response = yield fetch(CHAT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ video_id: videoId, message: userQuery }),
            });
            const data = yield response.json();
            if (response.ok) {
                displayResponse(data.response);
            }
            else {
                displayResponse(`Error: ${data.error}`);
            }
        }
        catch (error) {
            console.error("Error:", error);
            displayResponse("An error occurred while fetching the response.");
        }
    }
    else {
        displayResponse("Please enter a query.");
    }
});
const displayResponse = (message) => {
    const responseDiv = document.getElementById("response");
    if (responseDiv) {
        responseDiv.textContent = message;
    }
};
