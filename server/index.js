import express from 'express';
import http from 'http';
import pkg from 'colyseus';
const { Server } = pkg;
import GameRoom from './rooms/GameRoom.js';
import { matchMaker } from "@colyseus/core";

const app = express();
const port = process.env.PORT || 2567;

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204); // No Content
    } else {
        next();
    }
});

matchMaker.controller.getCorsHeaders = function (req) {
    try {
      return {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',               // Allow credentials
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      };
    } catch (error) {
      console.error("CORS configuration error:", error);
      return {};
    }
  };
  
// Create HTTP & WebSocket servers
const server = http.createServer(app);

const gameServer = new Server({
    server
});

// Register the GameRoom
gameServer.define('game_room', GameRoom);

// Start the server
gameServer.listen(port);
console.log(`Colyseus server is listening on ws://localhost:${port}`);

// Set up a simple route to check the server status
app.get('/', (req, res) => {
  res.send('Colyseus server is running');
});
