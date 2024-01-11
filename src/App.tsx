import "./App.css";
import { sleep, Operation } from "effection";
import { Player } from "./components/Player";
import { useState } from "react";

export const App = () => {
  const [options, setOptions] = useState({
    retryAttempts: 3,
    showSpinnerAfterInterval: 1000,
    loadingInterval: 3000,
    loadingSlowlyInterval: 4000,
    failedAttemptErrorInterval: 1000,
    retryingMessageInterval: 1000,
  });

  return (
    <>
      <h1 className="text-2xl m-5">Loading Spinner in React in Effection</h1>
      <div className="rounded bg-sky-50 p-4 m-4">
        <h2 className="text-lg mb-2">Options</h2>
        <div className="grid grid-rows lg:grid-cols-6">
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="lg:px-4 first:pl-0 last:pr-0">
              <label
                htmlFor={key}
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {key}
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="number"
                  name={key}
                  id={key}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  value={value}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      [key]: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ul className="grid grid-col divide-y">
        <li key="0" className="p-5">
          <Player
            title="Succeeds immidiately"
            description="Loading spinner is not visible"
            // eslint-disable-next-line require-yield
            load={function* success(): Operation<string> {
              return "Great Success!!!";
            }}
            {...options}
          />
        </li>
        <li key="1" className="p-5">
          <Player
            title="Succeeds after 2 seconds"
            description="Shows loading spinner after 1 second, then shows the result"
            load={function* shortSleep(): Operation<string> {
              yield* sleep(2000);

              return "Great Success!!!";
            }}
            {...options}
          />
        </li>
        <li key="2" className="p-5">
          <Player
            title="Succeeds after 9 seconds"
            description="Shows loading spinner after 1 second, then show spinner for 4s, then shows longer than expected message for 4 seconds, then back to loading spinner, then the result"
            load={function* longSleep(): Operation<string> {
              yield* sleep(9000);

              return "Great Success!!!";
            }}
            {...options}
          />
        </li>
        <li key="3" className="p-5">
          <Player
            title="Fail after 4 seconds, succeed on second attempt after 2 seconds"
            description="Shows loading spinner after 1 second, show loading spinner for 3 seconds, show error for 3 second, restart and succeed after 2 seconds."
            load={function* successAfterFailure({
              attempt,
            }): Operation<string> {
              switch (attempt) {
                case 0:
                  yield* sleep(4000);
                  throw new Error(`Could not get the value`);
                case 1:
                  yield* sleep(2000);
              }
              return "Great Success!!!";
            }}
            {...options}
          />
        </li>
        <li key="4" className="p-5">
          <Player
            title="Fail twice, taking progressively longer with each, succeed on third attempt"
            description="Shows loading spinner, then fails, shows retrying, then show loading spinner with taking too long, then fails, then tries again and succeeds."
            load={function* failTwice({ attempt }): Operation<string> {
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
            }}
            {...options}
          />
        </li>
        <li key="5" className="p-5">
          <Player
            title="Fails 3 times in 500ms each"
            description=""
            load={function* fail(): Operation<string> {
              yield* sleep(500);

              throw new Error(`Could not connnect to the server`);
            }}
            {...options}
          />
        </li>
        <li key="6" className="p-5">
          <Player
            title="Using async function"
            description="Allows using an async/await function and handles automatically cancelling using passed signal"
            load={async function ({ attempt, signal }) {
              switch (attempt) {
                case 0: {
                  const response = await fetch(
                    "https://swapi-proxy.deno.dev/api/people/1?delay=3000&status=500",
                    {
                      signal,
                    }
                  );

                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error(`${response.status}`);
                  }
                }
                default: {
                  const response = await fetch(
                    "https://swapi-proxy.deno.dev/api/people/1?delay=5000",
                    {
                      signal,
                    }
                  );

                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error(`${response.status}`);
                  }
                }
              }
            }}
            {...options}
          />
        </li>
      </ul>
    </>
  );
};
