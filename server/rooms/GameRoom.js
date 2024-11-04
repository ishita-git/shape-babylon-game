import { Room } from 'colyseus';

class GameRoom extends Room {
  maxClients = 10;

  onCreate(options) {
    console.log("GameRoom created!");

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

    // Notify all other clients about the new player
    this.broadcast("player_joined", { id: client.sessionId }, { except: client });
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
