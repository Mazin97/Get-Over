const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('EntrandoConversa', (data) => {
    socket.join(data.room);
  });

  socket.on('SaindoConversa', (data) => {
    socket.leave(data.room);
  });

  socket.on('NovaMensagem', (data) => {
    socket.broadcast
      .to(data.room)
      .emit('MensagemRecebida', data.msg);
  });
});

// Remember to change info between <>
mongoose.connect('mongodb+srv://<user>:<password>@cluster0-fnr9l.mongodb.net/<cluster>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());
app.use(require('./routes'));

server.listen(3333);
