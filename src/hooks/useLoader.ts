import { useEffect, useMemo, useState } from "react";
import { run, Operation } from "effection";
import { createLoader } from "../operations/createLoader";

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
  op: (attempt: number) => Operation<T>,
  retryAttempts: number = 3,
): LoaderState<T> {
  const [state, setState] = useState<LoaderState<T>>({ type: "initial" });

  const main = useMemo(() => createLoader({
    retryAttempts,
    setState,
    op,
  }), [setState, op, retryAttempts]);

  useEffect(() => {
    const task = run(main);

    return () => {
      task.halt();
      setState({
        type: "initial"
      });
    };
  }, [main]);

  return state;
}
