import { useEffect, useState } from "react";
import style from "../css/lowerThird.module.css"
import { Socket } from "socket.io-client";
import { socket } from "../socket";
import { LowerThirdItem } from "./control";

export default function LowerThirdGraphic() {
  
  const [active, setActive] = useState(false);
  const [state, setState] = useState<LowerThirdItem>({name:"",role:"",active:"false"})

  useEffect(() => {

    function onPlay(state: LowerThirdItem) {
      console.log("onPlay", state);
      setState(state);
      setActive(true)
    }

    function onStop(state: LowerThirdItem) {
        console.log("onStop", state);
        setActive(false)
      }

    socket.on("play", onPlay);
    socket.on("stop", onStop);

    return () => {
      socket.off("play", onPlay);
      socket.off("stop",onStop);
    };

  }, []);

  return (
    <div id={style.mask}>
      <div id={style.blueBar} className={active?style.animate:style.animate_out}></div>
      <div id={style.name} className={active?style.animate:style.animate_out}>{state.name}</div>
      <div id={style.greyBar} className={active?style.animate:style.animate_out}>
        <div id={style.role}>{state.role}</div>
      </div>
    </div>
  );
}
