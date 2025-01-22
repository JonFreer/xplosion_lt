import { Server, Socket } from "socket.io";


interface Score {
    team_a: string;
    team_b: string;
    score_a: number;
    score_b: number;
    active: boolean;
    quater: string;
    start_time: number;
}

let state:Score = {
    team_a: "Team A",
    team_b: "Team B",
    quater: "Q1",
    score_a: 0,
    score_b: 0,
    active: false,
    start_time: 0
}

export default function init(){
    console.log("init to ScoreHandler");
}

export function addConnection(socket: Socket, io: Server) {
    console.log("connected to ScoreHander");
    io.emit("score_state", state);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("score_update", (_state:Score)  => {
        state = _state;
        io.emit("score_state", state);
    });

    socket.on("score_stop", (id: string) => {
        state.active = false;
        io.emit("score_state", state);

    });

    socket.on("score_play", (id: string) => {
        state.active = true;
        io.emit("score_state", state);
    
    });


}
