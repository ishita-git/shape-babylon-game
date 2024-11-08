import * as Colyseus from "colyseus.js";

// Extend Colyseus client to set withCredentials
class CustomClient extends Colyseus.Client {
    constructor(url) {
        super(url);
    }

    createRequest(route, method = "GET", options = {}) {
        options.credentials = 'include';  
        return fetch(route, options);
    }
}

const client = new CustomClient("ws://localhost:3000/api");

let room;

export async function connectToRoom() {
    try {
        room = await client.joinOrCreate("game_room");

        displayMessage("GameRoom created!", "green");

         // Verify state synchronization with the schema
         room.onStateChange((state) => {
            console.log("Received state change:", state);  // Should log your GameState
        });


        // Listen for shape updates from other players
        room.onMessage("update_shape", (message) => {
            const { id, shape, position } = message;
            handleShapeUpdate(id, shape, position);
        });

        // Listen for new player joining
        room.onMessage("player_joined", (message) => {
            console.log(`Player joined: ${message.id}`);
        });

        // Listen for player leaving
        room.onMessage("player_left", (message) => {
            console.log(`Player left: ${message.id}`);
            removeShape(message.id);
        });

        console.log("Connected to room!");
    } catch (error) {
        console.error("Failed to connect to room:", error);
    }
}

export function sendShapeUpdate(shape, position) {
    if (!room) {
        console.error("Room is not connected. Cannot send shape update.");
        return;
    }
    room.send("select_shape", { shape, position });
}

function handleShapeUpdate(id, shape, position) {
    console.log(`Shape update from ${id}:`, shape, position);

}

function removeShape(id) {
    console.log(`Removing shape for ${id}`);
}

// Helper function to display messages with color on the UI
function displayMessage(text, color) {
    const messageElement = document.createElement("div");
    messageElement.innerText = text;
    messageElement.style.color = color;
    document.getElementById("player-info").appendChild(messageElement);
}
