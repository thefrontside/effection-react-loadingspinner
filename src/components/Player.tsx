import { useState } from "react";
import { Operation } from "effection";
import { Runner } from "../App";


export interface PlayerProps {
  title: string;
  description: string;
  op: (attempt: number) => Operation<string>;
}

export function Player({ title, description, op }: PlayerProps) {
  const [playing, setPlaying] = useState<boolean>(false);

  return (
    <>
      <div className="grid lg:grid-cols-2 lg:gap-2">
        <div>
          <h3 className="text-lg">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
        <div className="grid grid-cols-6 gap-4 mt-2 lg:mt-0">
          {playing ? (
            <>
              <button
                className="rounded bg-red-800 text-white p-4"
                onClick={() => setPlaying(false)}
              >
                Stop
              </button>
              <div className="border border-1 rounded border-solid border-blue-800 p-2 col-span-5">
                <Runner op={op} />
              </div>
            </>
          ) : (
            <>
              <button
                className="rounded bg-blue-800 text-white p-4"
                onClick={() => setPlaying(true)}
              >
                Play
              </button>
              <div className="border border-1 rounded border-solid border-slate-100 p-2 col-span-5"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
