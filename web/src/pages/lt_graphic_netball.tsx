import { useEffect, useState } from "react";
import style from "../css/lowerThird.netball.module.css"
import { socket } from "../socket";
import { LowerThirdItem } from "./lt_control";

export default function LowerThirdGraphicNetball() {
  
  const [active, setActive] = useState(false);
  const [state, setState] = useState<LowerThirdItem>({name:"Test Name",role:"Test Role",active:"false"})

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

    socket.on("lt_play", onPlay);
    socket.on("lt_stop", onStop);

    return () => {
      socket.off("lt_play", onPlay);
      socket.off("lt_stop",onStop);
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
