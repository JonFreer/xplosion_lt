import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { Socket } from "socket.io-client";

export interface Row {
  items: string[];
}

export enum mode {
  OneVOne,
  Leaderboard,
}

export interface Table {
  title: string;
  subtitle: string;
  mode: mode;
  rows: Row[];
}

interface StateType {
  tables: Record<string, Table>;
  active: string | null;
}

export default function GraphControl() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [state, setState] = useState<StateType>({
    tables: {},
    active: null,
  });

  useEffect(() => {
    function onState(msg: any) {
      console.log("onState", msg);
      setState(msg);
    }

    socket.on("graph_state", onState);

    return () => {
      socket.off("graph_state", onState);
    };
  }, []);

  return (
    <>
      <div className="flex bg-slate-200">
        <h1 className=" p-2 m-3 font-bold text-xl">Graph Controller</h1>
        {isEditMode ? (
          <div
            className="ml-auto p-2 m-3 font-bold bg-blue-400 rounded-lg text-white select-none cursor-pointer"
            onClick={() => setIsEditMode(false)}
          >
            Done
          </div>
        ) : (
          <div
            className="ml-auto p-2 m-3 font-bold bg-blue-400 rounded-lg text-white select-none cursor-pointer"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </div>
        )}
      </div>

      <div className="flex flex-col bg-slate-200">
        {Object.entries(state.tables).map(
          ([id, v]: [string, Table], _idx: number) =>
            !isEditMode ? (
              <Table
                state={v}
                socket={socket}
                active={state.active}
                id={id}
              ></Table>
            ) : (
              <TableEdit state={v} socket={socket} id={id}></TableEdit>
            )
        )}

        {isEditMode ? <RowNew socket={socket} /> : <></>}
      </div>
    </>
  );
}

function Table({
  state,
  active,
  socket,
  id,
}: {
  state: Table;
  active: string | null;
  socket: Socket;
  id: string;
}) {
  return (
    <div className="m-2 text-lg bg-white rounded-lg flex flex-row">
      <div className="p-3 font-bold">{state.title}</div>
      <div className="p-3 pl-5">{state.subtitle}</div>
      <div
        className={`p-3 ml-auto  text-white font-bold select-none cursor-pointer ${
          true ? "bg-green-600" : "bg-slate-300"
        }`}
        onClick={() => {
          socket.emit("graph_play", id);
        }}
      >
        Play
      </div>
      <div
        className={`p-3 rounded-r-lg text-white font-bold select-none cursor-pointer ${
          active == id ? "bg-red-600" : "bg-slate-300"
        }`}
        onClick={() => {
          socket.emit("graph_stop", id);
        }}
      >
        Stop
      </div>
    </div>
  );
}

function TableEdit({
  state,
  socket,
  id,
}: {
  state: Table;
  socket: Socket;
  id: string;
}) {
  function onChangeHangle(key: string, value: string) {
    socket.emit("graph_update", { key: key, value: value, id: id });
  }

  function onRemove() {
    socket.emit("graph_remove", id);
  }

  return (
    <div className="flex flex-col m-2 bg-white rounded-lg ">
      <div className=" text-lg flex flex-row border-b">
        <input
          className="p-3 font-bold rounded-tl-lg flex-1 min-w-40"
          value={state.title}
          onChange={(event) => {
            onChangeHangle("title", event.target.value);
          }}
        />
        <input
          className="p-3 pl-5 flex-1 min-w-40"
          value={state.subtitle}
          onChange={(event) => {
            onChangeHangle("subtitle", event.target.value);
          }}
        />
        <div
          className="p-3 ml-auto text-white font-bold select-none cursor-pointer bg-red-600 rounded-tr-lg"
          onClick={() => onRemove()}
        >
          {" "}
          Remove Table{" "}
        </div>
      </div>
      {state.mode == mode.Leaderboard?<LeaderBoardEdit state={state} id={id} socket={socket}/>:<OneVOneEdit state={state} id={id} socket={socket}/>}
      
    </div>
  );
}

function LeaderBoardEdit({
  state,
  socket,
  id,
}: {
  state: Table;
  socket: Socket;
  id: string;
}) {
  function onRowRemove(idx: number) {
    socket.emit("graph_remove_row", { id: id, idx: idx });
  }

  function onRowChangeHangle(value: string, row: number, idx: number) {
    socket.emit("graph_update_row", {
      value: value,
      row: row,
      idx: idx,
      id: id,
    });
  }

  // const rows_without_heading = state.rows.splice(0,1);

  return (
    <div>
       <div className="flex flex-row m-2 border rounded-lg bg-slate-300">

          {state.rows[0].items.map((value: string, col_idx: number) => (
               <input
               className={`p-3 flex-1 min-w-40 border-r  bg-transparent ${col_idx==0?"rounded-l-lg":""}`}
               placeholder={"Heading "+col_idx}
               value={value}
               onChange={(event) => {
                onRowChangeHangle(event.target.value, 0, col_idx);
              }}
             />
          ))}
       
          <div
            className="py-3 ml-auto text-white font-bold select-none cursor-pointer bg-blue-500 rounded-r-lg w-12 text-center"
            onClick={()=>{socket.emit("graph_create_col",{id:id})}}
          >+</div>

        </div>
      {state.rows.slice(1).map((row: Row, idx: number) => (
        <div className="flex flex-row m-2 border rounded-lg">
          {row.items.map((value: string, col_idx: number) => (
          <input
            className={`p-3 flex-1 min-w-40 border-r ${col_idx==0?"rounded-l-lg":""}`}
            placeholder={"Value "+col_idx}
            value={value}
            onChange={(event) => {
              onRowChangeHangle(event.target.value, idx+1,col_idx);
            }}
          />
          ))}
   
          <div
            className="py-3 ml-auto text-white font-bold select-none cursor-pointer bg-red-600 rounded-r-lg w-12 text-center"
            onClick={() => onRowRemove(idx+1)}
          >
            x
          </div>
        </div>
      ))}

      <SubRowNew socket={socket} id={id} numCols={state.rows[0].items.length}></SubRowNew>
    </div>
  );
}

function OneVOneEdit({
  state,
  socket,
  id,
}: {
  state: Table;
  socket: Socket;
  id: string;
}) {
  function onRowRemove(idx: number) {
    socket.emit("graph_remove_row", { id: id, idx: idx });
  }

  function onRowChangeHangle(value: string, row: number, idx: number) {
    socket.emit("graph_update_row", {
      value: value,
      row: row,
      idx: idx,
      id: id,
    });
  }

  return (
    <div>
      {state.rows.map((row: Row, idx: number) => (
        <div className="flex flex-row m-2 border rounded-lg">
          <input
            className="p-3 flex-1 min-w-40 border-r rounded-l-lg"
            placeholder={"Team A"}
            value={row.items[0]}
            onChange={(event) => {
              onRowChangeHangle(event.target.value, idx, 0);
            }}
          />
          <input
            className="p-3 flex-1 min-w-40 border-r"
            placeholder={"Score"}
            value={row.items[1]}
            onChange={(event) => {
              onRowChangeHangle(event.target.value, idx, 1);
            }}
          />
          <input
            className="p-3 flex-1 min-w-40"
            placeholder={"Team B"}
            value={row.items[2]}
            onChange={(event) => {
              onRowChangeHangle(event.target.value, idx, 2);
            }}
          />
          <div
            className="py-3 ml-auto text-white font-bold select-none cursor-pointer bg-red-600 rounded-r-lg w-12 text-center"
            onClick={() => onRowRemove(idx)}
          > x
          </div>
        </div>
      ))}

      <SubRowNew socket={socket} id={id} numCols={3}></SubRowNew>
    </div>
  );
}

function SubRowNew({ socket, id, numCols }: { socket: Socket; id: string, numCols:number }) {

  // const refs :Ref<HTMLInputElement | null>[] = [];

  const refs = useRef<(HTMLInputElement | null)[]>(Array(numCols).fill(null));

  function onChangeHangle() {
    console.log(refs.current)
    socket.emit("graph_create_row", {
      id: id,
      items: refs.current.map((ref) => ref?.value),
    });
   
    refs.current.forEach((ref) => {if (ref) {ref.value = ""}});
  }

  return (
    <div className="flex flex-row m-2 border rounded-lg">

{Array.from({ length: numCols }).map((_, col_idx) => (
      <input
        ref={(el) => (refs.current[col_idx] = el)}
        className={`p-3 flex-1 min-w-40 border-r  bg-transparent ${col_idx==0?"rounded-l-lg":""}`}
        placeholder={"Value "+col_idx}
      />
      ))}
 
      <div
        className="py-3 ml-auto text-white font-bold select-none cursor-pointer bg-green-600 rounded-r-lg w-12 text-center"
        onClick={() => onChangeHangle()}
      >
        Add
      </div>
    </div>
  );
}

function RowNew({ socket }: { socket: Socket }) {
  const inputRefA = useRef<HTMLInputElement | null>(null);
  const inputRefB = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  function onChangeHangle() {
    socket.emit("graph_create", {
      title: inputRefA.current?.value,
      subtitle: inputRefB.current?.value,
      mode: selectRef.current?.value,
    });
    inputRefA.current!.value = "";
    inputRefB.current!.value = "";
  }

  return (
    <div className="m-2">
      <span className="pl-1">New Table</span>
      <div className="flex flex-row border rounded-lg">
        <input
          ref={inputRefA}
          className="p-3 flex-1 min-w-40 border-r rounded-l-lg"
          placeholder={"Title"}
        />
        <input
          ref={inputRefB}
          className="p-3 flex-1 min-w-40 border-r"
          placeholder={"Subtitle"}
        />
        <select className="bg-white p-3" ref={selectRef}>
          <option value={mode.OneVOne}>One vs One</option>
          <option value={mode.Leaderboard}>Leaderboard</option>
        </select>
        <div
          className="py-3 ml-auto text-white font-bold select-none cursor-pointer bg-green-600 rounded-r-lg w-12 text-center"
          onClick={() => onChangeHangle()}
        >
          Add{" "}
        </div>
      </div>
    </div>
  );
}
