const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const state = require("./state.json");
state.active = null;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/lt", (req, res) => {
  res.sendFile(__dirname + "/graphics.html");
});

app.get("/font", (req, res) => {
  res.sendFile(__dirname + "/Helvetica-Bold.otf");
});

io.on("connection", (socket) => {
  io.emit("state", state);

  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("stop", (id) => {
    if(id == state.active){
      console.log(id);
      state.lowerThirds[id].active = "false";
      state.active = null;
      io.emit("state", state);
      io.emit("stop", state.lowerThirds[id]);
    }
  });

  socket.on("play", (id) => {
    console.log("play", id);
    if (state.active == null) {
      state.lowerThirds[id].active = "true";
      if (state.active != null) {
        state.lowerThirds[state.active].active = "false";
      }
      state.active = id;
      console.log(state);
      io.emit("state", state);
      io.emit("play", state.lowerThirds[id]);
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
