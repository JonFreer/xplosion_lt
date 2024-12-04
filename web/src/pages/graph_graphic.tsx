import { useEffect, useState } from "react";
import style from "../css/graph.module.css";
import { socket } from "../socket";
import { mode, Row, Table } from "./graph_control";

const rowAniDuration = 120;
const subtitleAniDuration = 140;

export default function GraphGraphic() {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(-2);
  const [state, setState] = useState<Table>({
    title: "",
    subtitle: "",
    rows: [],
    mode: mode.OneVOne,
  });
  useEffect(() => {
    function onPlay(state_new: Table) {
      console.log("onPlay", state, active);
      if (active != 0) {
        console.log("Playing Second Stage");

        countDown(state);

        setTimeout(() => setActive(2), 700);

        setTimeout(function () {
          setState(state_new);
          setActive(3);
        }, 1500);

        setTimeout(() => countUp(state_new), 1500);

        setTimeout(() => setActive(4), 2000);
      } else {
        setState(state_new);
        setActive(1);
        setTimeout(() => countUp(state_new), 1800);
      }
    }

    function countDown(state: Table) {
      for (let i = -2; i < state.rows.length; i++) {
        setTimeout(
          () => setCount(i),
          subtitleAniDuration + rowAniDuration * (state.rows.length - i + 1)
        );
      }
    }

    function countUp(state: Table) {
      for (let i = -1; i < state.rows.length; i++) {
        setTimeout(() => setCount(i), subtitleAniDuration + rowAniDuration * i);
      }
    }

    function onStop() {

      for (let i = -2; i < state.rows.length; i++) {
        setTimeout(() => setCount(i), rowAniDuration * (state.rows.length - i));
      }

      setTimeout(() => setActive(0), 800);
    }

    socket.on("graph_play", onPlay);
    socket.on("graph_stop", onStop);

    return () => {
      socket.off("graph_play", onPlay);
      socket.off("graph_stop", onStop);
    };

  }, [active, count]);

  var bg_style = "";
  var title_style = "";
  if (active == 0) {
    bg_style = style.name_animate_out;
    title_style = style.name_animate_out;
  } else if (active == 1) {
    bg_style = style.bg_animate;
    title_style = style.name_animate;
  } else {
    bg_style = style.bg_animate;
    title_style = style.name_animate;
  }

  console.log("Count", count);

  return (
    <div className={style.outline}>
      <div className={style.wrapper}>
        <div id={style.line1}>
          <div className={`${style.bg} ${bg_style}`}></div>
          <div className={`${style.title} ${title_style}`}>{state.title}</div>
          <div
            className={`${style.mask} ${
              active == 2 || active == 3 ? style.mask_animate : ""
            }`}
          ></div>
        </div>
        <div
          className={`${style.line2} ${
            count >= -1 ? style.height_animation : style.height_animation_out
          }`}
        >
          <div className="py-3 flex">
            {state.mode == mode.OneVOne ? (
              state.subtitle
            ) : (
              <>
                <div className="flex-1">{state.rows[0].items[0]}</div>
                {state.rows[0].items.slice(1).map((value: string) => (
                  <>
                    <div className="w-40 "></div>
                    <div className={` w-44 text-center`}>{value}</div>
                  </>
                ))}
              </>
            )}
          </div>
        </div>
        <div id={style.rows}>
          {state.mode == mode.OneVOne
            ? state.rows.map((row, idx) => (
                <RowOneVOne row={row} active={count >= idx} />
              ))
            : state.rows
                .slice(1)
                .map((row, idx) => (
                  <RowLeaderboard row={row} active={count >= idx} />
                ))}
        </div>
      </div>
    </div>
  );
}

function RowOneVOne({ row, active }: { row: Row; active: boolean }) {
  return (
    <div
      className={`transition-[height] duration-100 h-0 ${style.row} ${
        active ? style.height_animation_row : style.height_animation_out
      }`}
    >
      <div
        className={`  relative bg-white h-[56px] flex leading-[56px] text-center overflow-hidden `}
      >
        <div className="flex-1">{row.items[0]}</div>
        <div className={` w-44 ${style.dropshadow}`}>{row.items[1]}</div>
        <div className="flex-1">{row.items[2]}</div>
      </div>
    </div>
  );
}

function RowLeaderboard({ row, active }: { row: Row; active: boolean }) {
  return (
    <div
      className={`transition-[height] duration-100 h-0 ${style.row} ${
        active ? style.height_animation_row : style.height_animation_out
      }`}
    >
      <div
        className={`  relative bg-white h-[56px] flex leading-[56px] text-center overflow-hidden `}
      >
        <div className="flex-1">{row.items[0]}</div>
        {row.items.slice(1).map((value: string) => (
          <>
            <div className=" flex-1 max-w-40 "></div>
            <div className={` w-44 ${style.dropshadow}`}>{value}</div>
          </>
        ))}
      </div>
    </div>
  );
}
