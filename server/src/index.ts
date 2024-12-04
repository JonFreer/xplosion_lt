import {Server} from 'socket.io';
import lowerThirdHandler,{addConnection as lt_addConnection}  from './lowerThirdHandler';

const io = new Server({
  cors: {
    origin: "http://localhost"
  }
});

lowerThirdHandler();

io.listen(4001);

console.log("listenting on port 4001")
io.on("connection", (socket) => {
  console.log("connection");
  lt_addConnection(socket,io);

});

