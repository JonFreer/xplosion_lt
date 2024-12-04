import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

interface Row {
    items: string[];
}

enum mode{
    OneVOne,
    Leaderboard
}

interface Table{
    title: string;
    subtitle: string;
    mode: mode,
    rows: Row[];
}
  
interface StateType {
    tables:Record<string, Table>;
    active: string | null;
}

const state: StateType = {
    tables:{
        "first": {
            title: "Test 123",
            subtitle: "Test 121",
            mode: mode.OneVOne,
            rows:[{items:["Jon","12-5","Steve"]}]
        }
    },
    active:null
}

export default function init(){
    console.log("init to LowerThirdHandler");
    state.active = null;
}

export function addConnection(socket: Socket, io: Server) {
    console.log("connected to GraphHandler");
    io.emit("graph_state", state);

    socket.on("graph_stop", (id: string) => {
        if (id == state.active) {
            console.log(id);
            state.active = null;
            io.emit("graph_state", state);
            io.emit("graph_stop", state.tables[id]);
        }
    });

    socket.on("graph_play", (id: string) => {
        console.log("play", id);
        state.active = id;
        console.log(state);
        io.emit("graph_state", state);
        io.emit("graph_play", state.tables[id]);
    });

    socket.on("graph_update", (msg: {key:string, value:string,id:string}) => {
        console.log("graph_update", msg);
        if(msg.key == "title" || msg.key == "subtitle"){
            state.tables[msg.id][msg.key] = msg.value;
            console.log("update")
        }
        io.emit("graph_state", state);
    });

    socket.on("graph_update_row", (msg: {id:string, value:string,row:number,idx:number}) => {
        console.log("graph_update", msg);
        state.tables[msg.id].rows[msg.row].items[msg.idx] = msg.value;
        io.emit("graph_state", state);
    });

    socket.on("graph_create", (msg : {title: string, subtitle:string, mode:mode}) => {
        console.log("graph_create", msg);

        var rows:Row[] = [];

        if(msg.mode == mode.Leaderboard){
            rows = [{items:["",""]}] // first row is the heading
        }

        state.tables[uuidv4()] = {
            title: msg.title,
            subtitle: msg.subtitle,
            rows: rows,
            mode: msg.mode
        };
        io.emit("graph_state", state);
    });

    socket.on("graph_create_row", (msg:{id:string, items:string[]}) => {
        console.log("graph_create_row", msg);
        state.tables[msg.id].rows.push({items:msg.items})
        io.emit("graph_state", state);
    });

    socket.on("graph_create_col", (msg:{id:string}) => {
        console.log("graph_create_row", msg);
        state.tables[msg.id].rows.forEach((row)=>{row.items.push("")});
        io.emit("graph_state", state);
    });

    socket.on("graph_remove", (id : string) => {
        console.log("graph_remove", id);
        if (state.active == id) {
            state.active = null;
            io.emit("graph_stop", state.tables[id]);
        }
        delete state.tables[id];
        io.emit("graph_state", state);
    });

    socket.on("graph_remove_row", (msg: {id:string, idx:number}) => {
        state.tables[msg.id].rows.splice(msg.idx, 1);
        io.emit("graph_state", state);
    });
}
