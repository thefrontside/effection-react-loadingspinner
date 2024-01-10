import "./App.css";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useLoader } from "./hooks/useLoader";
import { sleep, Callable, Operation } from "effection";
import { Player } from "./components/Player";

export function Runner({ fetcher }: { fetcher: (attempt: number, signal: AbortSignal) => Callable<string> }) {
  const loader = useLoader(fetcher);

  return <LoadingSpinner loader={loader} />;
}

export const App = () => {
  return (
    <>
      <h1 className="text-2xl m-5">
        Loading Spinner in React in Effection
      </h1>
      <ul className="grid grid-col divide-y">
        <li key="0" className="p-5">
          <Player
            title="Succeeds immidiately"
            description="Loading spinner is not visible"
            op={success}
          />
        </li>
        <li key="1" className="p-5">
          <Player
            title="Succeeds after 2 seconds"
            description="Shows loading spinner after 1 second, then shows the result"
            op={shortSleep}
          />
        </li>
        <li key="2" className="p-5">
          <Player
            title="Succeeds after 9 seconds"
            description="Shows loading spinner after 1 second, then show spinner for 4s, then shows longer than expected message for 4 seconds, then back to loading spinner, then the result"
            op={longSleep}
          />
        </li>
        <li key="3" className="p-5">
          <Player
            title="Fail after 4 seconds, succeed on second attempt after 2 seconds"
            description="Shows loading spinner after 1 second, show loading spinner for 3 seconds, show error for 3 second, restart and succeed after 2 seconds."
            op={successAfterFailure}
          />
        </li>
        <li key="4" className="p-5">
          <Player
            title="Fail twice, taking progressively longer with each, succeed on third attempt"
            description="Shows loading spinner, then fails, shows retrying, then show loading spinner with taking too long, then fails, then tries again and succeeds."
            op={failTwice}
          />
        </li>
        <li key="5" className="p-5">
          <Player
            title="Fails 3 times in 500ms each"
            description=""
            op={fail}
          />
        </li>
      </ul>
    </>
  );
};

// eslint-disable-next-line require-yield
function* success(): Operation<string> {
  return "Great Success!!!";
}

function* shortSleep(): Operation<string> {
  yield* sleep(2000);

  return "Great Success!!!";
}

function* failTwice(attempt: number): Operation<string> {
  switch (attempt) {
    case 0:
      yield* sleep(2000);

      throw new Error(`Failed to connect to external service`);
    case 1:
      yield* sleep(6000);

      throw new Error(`Connection timed out`);
    case 2:
      yield* sleep(2000);
  }
  return "Great Success!!!";
}

function* longSleep(): Operation<string> {
  yield* sleep(9000);

  return "Great Success!!!";
}

function* successAfterFailure(attempt: number): Operation<string> {
  switch (attempt) {
    case 0:
      yield* sleep(4000);
      throw new Error(`Could not get the value`);
    case 1:
      yield* sleep(2000);
  }
  return "Great Success!!!";
}

function* fail(): Operation<string> {
  yield* sleep(500);

  throw new Error(`Could not connnect to the server`);
}