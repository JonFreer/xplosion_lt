import { useEffect, useState } from "react";
import style from "../css/score.module.css"
import { socket } from "../socket";
import { Score } from "./score_control";



export default function ScoreGraphic() {

  const [active, setActive] = useState(false);
  const [state, setState] = useState<Score>({team_a:"",team_b:"",score_a:0,score_b:0,active:false})

  useEffect(() => {

    function onPlay(state: Score) {
      console.log("onPlay", state);
      setState(state);
      setActive(true)
    }

    function onStop(state: Score) {
        console.log("onStop", state);
        setActive(false)
      }

    function onState(state: Score) {
        console.log("onState", state);
        setState(state)
    }

    socket.on("score_play", onPlay);
    socket.on("score_stop", onStop);

    socket.on("score_state", onState);

    return () => {
      socket.off("score_play", onPlay);
      socket.off("score_stop",onStop);
    };

  }, []);

  return (
    <div id={style.mask}>
      <div id={style.scorebar} className={active?style.animate:style.animate_out}>
        <div className={style.teamName}>{state.team_a}</div>
        <div className={style.score}>{state.score_a}</div>
        <div className={style.score}>-</div>
        <div className={style.score}>{state.score_b}</div>
        <div className={style.teamName}>{state.team_b}</div>
      </div>
    </div>
  );
}
