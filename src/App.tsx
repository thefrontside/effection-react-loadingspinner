import "./App.css";

import { useLoader } from "./hooks/useLoader";
import { Scenario, scenarios } from "./scenarios";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Operation } from "effection";
import { useState } from "react";

function ScenarioRunner({ run }: { run: () => Operation<unknown> }) {
  const loader = useLoader(run);

  return (
    <div className="border-1 h-5">
      <LoadingSpinner loader={loader} />
    </div> 
  )
}

function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [playing, setPlaying] = useState<boolean>(false);

  return (
    <>
      <h3>{scenario.title}</h3>
      <p>{scenario.description}</p>
      {playing ? (
        <ScenarioRunner run={scenario.run} />
      ) : (
        <button onClick={() => setPlaying(true)}>Play</button>
      )}
    </>
  );
}

const App = () => {
  return (
    <div>
      <h1>Retrying Loader Example in React with Effection</h1>
      <ul className="list-none">
        {scenarios.map((s, i) => (
          <li key={i}>
            <ScenarioPlayer scenario={s} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
