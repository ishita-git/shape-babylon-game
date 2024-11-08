import pkg from 'colyseus';
const { Room } = pkg;
import { Schema, type, defineTypes } from "@colyseus/schema";


class GameState extends Schema {
  constructor() {
      super();
    this.id = "";
    this.position = "",
    this.shape = ""
  }
}

defineTypes(GameState, {
  id: "string",
  position: "string",
  shape: "string"
});

class GameRoom extends Room {
  maxClients = 10;

  onCreate(options) {
    console.log("GameRoom created!");
    this.setSerializer("schema");  // Set schema serializer explicitly
    this.setState(new GameState()); 

    // Handle shape selection updates from players
    this.onMessage("select_shape", (client, message) => {
      const { shape, position } = message;
      // Broadcast the updated shape and position to all clients
      this.broadcast("update_shape", {
        id: client.sessionId,
        shape,
        position
      });
    });
    }
    
  onJoin(client) {
    console.log(`Player ${client.sessionId} joined!`);
    console.log(client)
  }
  onLeave(client) {
    console.log(`Player ${client.sessionId} left!`);

    // Notify all clients that this player has left
    this.broadcast("player_left", { id: client.sessionId });
  }

  onDispose() {
    console.log("GameRoom disposed!");
  }
}

export default GameRoom;
