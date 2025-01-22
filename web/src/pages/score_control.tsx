import { useEffect, useState } from "react";
import { socket } from "../socket";

export interface Score {
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  active: boolean;
}

export default function ScoreControl() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [state, setState] = useState<Score>({ team_a: "", team_b: "", score_a: 0, score_b: 0, active: false });

  useEffect(() => {

    function onState(msg: any) {
      console.log("onState", msg);
      setState(msg);
    }

    socket.on("score_state", onState);

    return () => {
      socket.off("score_state", onState);
    };
  }, []);


  function setStateViaSocket(state:Score){
    socket.emit("score_update", state);
  }

  return (
    <>
    
    <div  className="flex bg-slate-200">
      <div className="p-4 w-full max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team_a">
            Team A
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="team_a"
            type="text"
            value={state?.team_a || ""}
            onChange={(e) => setStateViaSocket({ ...state, team_a: e.target.value } as Score)}
            disabled={!isEditMode}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team_b">
            Team B
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="team_b"
            type="text"
            value={state?.team_b || ""}
            onChange={(e) => setStateViaSocket({ ...state, team_b: e.target.value } as Score)}
            disabled={!isEditMode}
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setStateViaSocket({ ...state, score_a: (state?.score_a || 0) + 1 } as Score)}
              disabled={!isEditMode}
            >
              +
            </button>
            <span className="mx-4 text-xl">{state?.score_a || 0}</span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setStateViaSocket({ ...state, score_a: (state?.score_a || 0) - 1 } as Score)}
              disabled={!isEditMode}
            >
              -
            </button>
          </div>
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setStateViaSocket({ ...state, score_b: (state?.score_b || 0) + 1 } as Score)}
              disabled={!isEditMode}
            >
              +
            </button>
            <span className="mx-4 text-xl">{state?.score_b || 0}</span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setStateViaSocket({ ...state, score_b: (state?.score_b || 0) - 1 } as Score)}
              disabled={!isEditMode}
            >
              -
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

