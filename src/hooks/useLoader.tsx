import { useEffect, useState } from "react";
import type { DependencyList } from "react";
import { run, Operation, sleep, spawn } from "effection";

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
  deps: DependencyList = []
): LoaderState<T> {
  const [state, setState] = useState<LoaderState<T>>({ type: "initial" });

  useEffect(() => {
    const task = run(function* main() {
      setState({
        type: "started",
      });

      for (let attempt = 0; attempt < retryAttempts; attempt++) {
        const loader = yield* spawn(function* loadingSpinner(): Operation<void> {
          yield* sleep(1000);

          let count = 0;
          while (true) {
            setState({
              type: "loading",
              count,
            });
            yield* sleep(3000);
            setState({
              type: "loading-slowly",
            });
            yield* sleep(4000);
            count++;
          }
        });

        try {
          const result = yield* op(attempt);

          setState({
            type: "success",
            value: result,
          });
          break;
        } catch (e) {
          yield* loader.halt();

          const error = e instanceof Error ? e : new Error(`${e}`);
          if (attempt + 1 === retryAttempts) {
            setState({
              type: "failed",
              error,
            });
          } else {
            setState({
              type: "failed-attempt",
              error,
            });
            yield* sleep(1000);
            setState({
              type: 'retrying',
              error,
            })
            yield* sleep(1000);
          }
        }

        yield* loader.halt();
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
