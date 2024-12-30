import express from 'express';
import http from 'http'
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } });

//setup ejs files
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on('send-location', ({ latitude, longitude }) => {
    io.emit('receive-location', { latitude, longitude }, {id: socket.id});
  });

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
  });
})

app.get('/', (req, res) => {
  res.render('index');
})

server.listen(4000, () => {
  console.log('Server is running on port 4000');
})