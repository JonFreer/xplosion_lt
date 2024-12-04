import {Server} from 'socket.io';
import lowerThirdHandler,{addConnection as lt_addConnection}  from './lowerThirdHandler';
import graphHandler,{addConnection as graph_addConnection}  from './graphHandler';

const io = new Server({
  cors: {
    origin: "http://localhost"
  }
});

lowerThirdHandler();
graphHandler(); //these might not be needed if we move outside of the init

io.listen(4001);
console.log("listenting on port 4001")

io.on("connection", (socket) => {
  console.log("connection");
  lt_addConnection(socket,io);
  graph_addConnection(socket,io);
});

