// chatbot.ts
import io from "socket.io-client";
// Replace with the Socket.IO server URL
const SOCKET_IO_ENDPOINT = "https://dchung.dev/socket.io/";
let socket;
window.onload = () => {
    // Initialize Socket.IO connection
    socket = io(SOCKET_IO_ENDPOINT);
    socket.on("connect", () => {
        console.log("Socket.IO connection established");
    });
    socket.on("llm_response", (data) => {
        if (data) {
            displayMessage(data.response);
            if (data.done) {
                console.log("Chat completed");
            }
        }
    });
    socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
    });
    const sendButton = document.getElementById("sendButton");
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }
};
const sendMessage = () => {
    const userInput = document.getElementById("userInput");
    if (userInput && userInput.value) {
        socket.emit("send_message", { message: userInput.value });
        userInput.value = "";
    }
};
const displayMessage = (message) => {
    const messagesDiv = document.getElementById("messages");
    if (messagesDiv) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
    }
};
// Optional: Close the Socket.IO connection when the window is closed/unloaded
window.onunload = () => {
    if (socket) {
        socket.disconnect();
    }
};
