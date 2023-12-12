import { useState } from "react";
import "./App.css";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useLoader } from "./hooks/useLoader";
import { Scenario, scenarios } from "./scenarios";

function ScenarioRunner({ run }: { run: Scenario['run'] }) {
  const loader = useLoader(run);

  return (
    <>
      <div className="border-2 rounded border-solid border-blue-800 p-2 col-span-4">
        <LoadingSpinner loader={loader} />
      </div>
      <div className="border-2 border-solid border-slate-300 p-2 col-span-1">
        {loader.type}
      </div>
    </>

  )
}

function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [playing, setPlaying] = useState<boolean>(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h3 className="text-lg">{scenario.title}</h3>
          <p className="text-slate-600">{scenario.description}</p>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {playing ? (
            <>
              <button
                className="rounded bg-red-800 text-white"
                onClick={() => setPlaying(false)}
              >
                Stop
              </button>
              <ScenarioRunner run={scenario.run} />
            </>
          ) : (
            <button
              className="rounded bg-blue-800 text-white"
              onClick={() => setPlaying(true)}
            >
              Play
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const App = () => {
  return (
    <>
      <h1 className="text-2xl m-5">
        Sophisticated Loading Spinner with Effection in React
      </h1>
      <ul className="grid grid-col divide-y">
        {scenarios.map((s, i) => (
          <li key={i} className="p-5">
            <ScenarioPlayer scenario={s} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
