import express from 'express';
import http from 'http'
import { Server } from 'socket.io';


const app = express();

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } });

app.get('/', (req, res) => {
  res.send('App Running');
})

server.listen(4000, () => {
  console.log('Server is running on port 4000');
})