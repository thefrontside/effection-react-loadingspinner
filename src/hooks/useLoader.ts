import { useMemo, useEffect, useState } from "react";
import { run, Callable } from "effection";
import { createLoader } from "../operations/createLoader";
import { UpdateFn, UpdateFnContext } from "../operations/UpdateFnContext";

export type LoaderState<T> =
  | {
      type: "initial";
    }
  | {
      type: "started";
    }
  | {
      type: "loading";
      count: number;
    }
  | {
      type: "loading-slowly";
    }
  | {
      type: "success";
      value: T;
    }
  | {
      type: "failed-attempt";
      error: Error;
    }
  | {
      type: "retrying";
      error: Error;
    }
  | {
      type: "failed";
      error: Error;
    };

    
export function useLoader<T>(
  fetcher: (attempt: number, signal: AbortSignal) => Callable<T>,
  retryAttempts: number = 3,
): LoaderState<T> {
  const [state, setState] = useState<LoaderState<T>>({ type: "initial" });

  const loader = useMemo(() => createLoader({
    retryAttempts,
    fetcher,
  }), [fetcher, retryAttempts]);

  useEffect(() => {
    const task = run(function* () {
      yield* UpdateFnContext.set(setState as UpdateFn);
      yield* loader();
    });

    return () => {
      run(() => task.halt());
    };
  }, [loader]);

  return state;
}
