const { v4: uuidv4 } = require('uuid');
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const state = require("./state.json");

const io = new Server({
  cors: {
    origin: "http://localhost:5173"
  }
});

io.listen(4000);

state.active = null;

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

  socket.on("lt_update", (msg)=>{
    console.log("lt_update", msg)
    state.lowerThirds[msg.id][msg.key] = msg.value;
    io.emit("state", state);
  })

  socket.on("lt_create", (msg)=>{
    console.log("lt_create", msg)
    state.lowerThirds[uuidv4()] = {name:msg.name,role:msg.role,active:"false",id:uuidv4()}
    io.emit("state", state);
  })

  socket.on("lt_remove", (id)=>{
    console.log("lt_remove", id)
    if(state.active == id){
      state.active = null;
      io.emit("stop", state.lowerThirds[id]);
    }
    delete state.lowerThirds[id]
    io.emit("state", state);
  });
});

