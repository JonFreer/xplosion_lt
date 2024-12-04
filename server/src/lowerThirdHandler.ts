import { Server, Socket } from "socket.io";
import state_untyped from './state.json';
import { v4 as uuidv4 } from 'uuid';

export interface LowerThirdItem {
    name: string;
    role: string;
    active: string;
}
  
interface StateType {
lowerThirds:Record<string, LowerThirdItem>;
active: string | null;
}

const state: StateType = state_untyped;

export default function init(){
    console.log("init to LowerThirdHandler");
    state.active = null;
}

export function addConnection(socket: Socket, io: Server) {
    console.log("connected to LowerThirdHandler");
    io.emit("lt_state", state);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("lt_stop", (id: string) => {
        if (id == state.active) {
            console.log(id);
            state.lowerThirds[id].active = "false";
            state.active = null;
            io.emit("lt_state", state);
            io.emit("lt_stop", state.lowerThirds[id]);
        }
    });

    socket.on("lt_play", (id: string) => {
        console.log("play", id);
        if (state.active == null) {
            state.lowerThirds[id].active = "true";
            if (state.active != null) {
                state.lowerThirds[state.active].active = "false";
            }
            state.active = id;
            console.log(state);
            io.emit("lt_state", state);
            io.emit("lt_play", state.lowerThirds[id]);
        }
    });

    socket.on("lt_update", (msg: {key:string, value:string,id:string}) => {
        console.log("lt_update", msg);
        state.lowerThirds[msg.id][msg.key as keyof LowerThirdItem] = msg.value;
        io.emit("lt_state", state);
    });

    socket.on("lt_create", (msg) => {
        console.log("lt_create", msg);
        state.lowerThirds[uuidv4()] = {
            name: msg.name,
            role: msg.role,
            active: "false"
        };
        io.emit("lt_state", state);
    });

    socket.on("lt_remove", (id : string) => {
        console.log("lt_remove", id);
        if (state.active == id) {
            state.active = null;
            io.emit("lt_stop", state.lowerThirds[id]);
        }
        delete state.lowerThirds[id];
        io.emit("lt_state", state);
    });
}
