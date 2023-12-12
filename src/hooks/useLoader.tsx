import { useEffect, useState } from "react";
import type { DependencyList } from "react";
import { run, Operation, sleep, spawn } from "effection";

export type LoaderState<T> =
  | {
      type: "initial";
    }
  | {
      type: "started";
      attempt: number;
    }
  | {
      type: "loading";
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
      attempt: number;
    }
  | {
      type: "failed";
      error: Error;
    };

export function useLoader<T>(
  op: () => Operation<T>,
  retryAttempts: number = 2,
  deps: DependencyList = []
): LoaderState<T> {
  const [state, setState] = useState<LoaderState<T>>({ type: "initial" });

  useEffect(() => {
    const task = run(function* main() {
      for (let attempt = 0; attempt < retryAttempts; attempt++) {
        setState({
          type: attempt === 0 ? "started" : "retrying",
          attempt,
        });
        try {
          yield* spawn(function* loadingSpinner(): Operation<void> {
            yield* sleep(1000);

            while (true) {
              setState({
                type: "loading",
              });
              yield* sleep(4000);
              setState({
                type: "loading-slowly",
              });
              yield* sleep(2000);
            }
          });

          const result = yield* op();

          setState({
            type: "success",
            value: result,
          });
          break;
        } catch (e) {
          setState({
            type: retryAttempts - 1 === attempt ? "failed" : "failed-attempt",
            error: e instanceof Error ? e : new Error(`${e}`),
          });
        }
      }
    });

    return () => {
      task.halt();
      setState({ type: "initial" });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [op, retryAttempts, ...deps]);

  return state;
}
