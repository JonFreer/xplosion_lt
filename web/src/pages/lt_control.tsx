import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { Socket } from "socket.io-client";

export interface LowerThirdItem {
  name: string;
  role: string;
  active: string;
}

interface StateType {
  lowerThirds:Record<string, LowerThirdItem>;
  active: string | null;
}

export default function Control() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [state, setState] = useState<StateType>({
    lowerThirds: {},
    active: null,
  });

  useEffect(() => {

    function onState(msg: any) {
      console.log("onState", msg);
      setState(msg);
    }

    socket.on("lt_state", onState);

    return () => {
      socket.off("lt_state", onState);
    };
  }, []);

  return (
    <>
    
    <div  className="flex bg-slate-200">
      <h1 className=" p-2 m-3 font-bold text-xl">Lower Thirds Controller</h1>
        {isEditMode? 
        <div className="ml-auto p-2 m-3 font-bold bg-blue-400 rounded-lg text-white select-none cursor-pointer" onClick={()=>setIsEditMode(false)}>Done</div>:
        <div className="ml-auto p-2 m-3 font-bold bg-blue-400 rounded-lg text-white select-none cursor-pointer" onClick={()=>setIsEditMode(true)}>Edit</div>}
    </div>

    <div className="flex flex-col bg-slate-200">

    
      {Object.entries(state.lowerThirds).map(([id, v]: [string, LowerThirdItem], _idx: number) => 
        !isEditMode?(<Row state={v} socket={socket} active={state.active} id={id}></Row>):
                (<RowEdit state={v} socket={socket} id={id}></RowEdit>)
      )}

      {isEditMode?<RowNew socket={socket}/>:<></>}
    </div>
    </>
  );
}

function Row({
  state,
  active,
  socket,
  id
}: {
  state: LowerThirdItem;
  active: string | null;
  socket: Socket;
  id: string;
}) {
  return (
    <div className="m-2 text-lg bg-white rounded-lg flex flex-row">
      <div className="p-3 font-bold">{state.name}</div>
      <div className="p-3 pl-5">{state.role}</div>
      <div
        className={`p-3 ml-auto  text-white font-bold select-none cursor-pointer ${
          active == null ? "bg-green-600" : "bg-slate-300"
        }`}
        onClick={() => {
          socket.emit("lt_play", id);
        }}
      >
        Play
      </div>
      <div
        className={`p-3 rounded-r-lg text-white font-bold select-none cursor-pointer ${
          active == id ? "bg-red-600" : "bg-slate-300"
        }`}
        onClick={() => {
          socket.emit("lt_stop", id);
        }}
      >
        Stop
      </div>
    </div>
  );
}


function RowEdit({
    state,
    socket,
    id
  }: {
    state: LowerThirdItem;
    socket: Socket;
    id: string;
  }) {

    function onChangeHangle(key: string,value: string){
        socket.emit("lt_update",{key:key,value:value,id:id})
    }

    function onRemove(){
        socket.emit("lt_remove",id)
    }

    return (
      <div className="m-2 text-lg bg-white rounded-lg flex flex-row">
        <input className="p-3 font-bold" value={state.name} onChange={(event)=>{onChangeHangle("name",event.target.value)}}/>
        <input className="p-3 pl-5" value={state.role} onChange={(event)=>{onChangeHangle("role",event.target.value)}}/>
        <div className="p-3 ml-auto text-white font-bold select-none cursor-pointer bg-red-600 rounded-r-lg" onClick={()=>onRemove()}> x </div>
      </div>
    );
  }

  function RowNew({

    socket,
  }: {
    socket: Socket;
  }) {

    const inputNameRef = useRef<HTMLInputElement | null>(null);
    const inputRoleRef = useRef<HTMLInputElement | null>(null);

    function onChangeHangle(){
        socket.emit("lt_create",{name:inputNameRef.current?.value,role:inputRoleRef.current?.value})

        inputNameRef.current!.value = "";
        inputRoleRef.current!.value = "";
    }

    return (
      <div className="m-2 text-lg bg-white rounded-lg flex flex-row">
        <input ref={inputNameRef} className="p-3 font-bold" placeholder="Name"/>
        <input ref={inputRoleRef} className="p-3 pl-5" placeholder="Role"/> 
        <div className="p-3 ml-auto text-white font-bold select-none cursor-pointer bg-green-600 rounded-r-lg" onClick={()=>onChangeHangle()}>Add </div>
      </div>
    );
  }

  