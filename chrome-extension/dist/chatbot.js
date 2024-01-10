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
// Replace with the WebSocket URL for your chat endpoint
const SOCKET_ENDPOINT = "ws://143.198.107.137:5000/socket.io/?EIO=3&transport=websocket";
let socket = null;
window.onload = () => {
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
const getVideoIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v") || "";
};
const submitQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = getVideoIdFromUrl();
    if (!videoId) {
        displayResponse("Invalid YouTube URL.");
        return;
    }
    const userQueryInput = document.getElementById("userQuery");
    const userQuery = userQueryInput ? userQueryInput.value : "";
    if (userQuery && socket) {
        socket.send(JSON.stringify({ query: userQuery, video_id: videoId }));
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
// Optional: Close the WebSocket connection when the window is closed/unloaded
window.onunload = () => {
    if (socket) {
        socket.close();
    }
};
