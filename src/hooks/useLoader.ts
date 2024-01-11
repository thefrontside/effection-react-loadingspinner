import { useMemo, useEffect, useState, useCallback } from "react";
import { run, type Callable } from "effection";
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

export type LoaderFn<T> = (params: { attempt: number, signal: AbortSignal }) => Callable<T>;

export function useLoader<T>(
  load: LoaderFn<T>,
  retryAttempts: number = 3,
) {
  const [state, setState] = useState<LoaderState<T>>({ type: "initial" });
  const [key, setKey] = useState<number>(0);

  const restart = useCallback(() => {
    setKey(key + 1);
  }, [key, setKey]);

  const loader = useMemo(() => createLoader({
    retryAttempts,
    load,
  }), [load, retryAttempts]);

  useEffect(() => {
    const task = run(function* () {
      yield* UpdateFnContext.set(setState as UpdateFn);
      yield* loader();
    });

    return () => {
      run(() => task.halt());
      setState({ type: "initial" })
    };
  }, [loader, key]);

  return [state, { restart }] as const;
}
