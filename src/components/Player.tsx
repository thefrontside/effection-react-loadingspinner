import { useState } from "react";
import { LoaderFn, UseLoaderOptions, useLoader } from "../hooks/useLoader";
import { LoadingSpinner } from "./LoadingSpinner";


export type PlayerProps = {
  title: string;
  description: string;
  load: LoaderFn<string>;
} & Required<UseLoaderOptions<string>>;

function Runner({ load, ...options }: { load: LoaderFn<string> } & Required<UseLoaderOptions<string>> ) {
  const [loader, { restart }] = useLoader(load, options);

  return (
    <>
      <button
        className="rounded bg-red-800 text-white p-4 mb-2 sm:ml-2 sm:mb-0"
        onClick={() => restart()}
      >
        Restart
      </button>
      <div className="border border-1 rounded border-solid border-blue-800 p-2 grow sm:ml-4">
        <LoadingSpinner loader={loader} />
      </div>
    </>
  )
}

export function Player({ title, description, ...props }: PlayerProps) {
  const [playing, setPlaying] = useState<boolean>(false);

  return (
    <>
      <div className="grid sm:grid-cols-2 sm:gap-2">
        <div>
          <h3 className="text-lg">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row mt-2 lg:mt-0">
          {playing ? (
            <>
              <button
                className="rounded bg-red-800 text-white p-4 mb-2 sm:mb-0"
                onClick={() => setPlaying(false)}
              >
                Stop
              </button>
              <Runner {...props} />
            </>
          ) : (
            <>
              <button
                className="rounded bg-blue-800 text-white p-4 mb-2 sm:mb-0"
                onClick={() => setPlaying(true)}
              >
                Play
              </button>
                <div className="border border-1 rounded border-solid border-slate-100 p-2 grow sm:ml-4"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
