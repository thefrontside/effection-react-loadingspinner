import { Operation, sleep, spawn } from "effection";
import { createSpinner } from "./createSpinner";
import { LoaderState } from "../hooks/useLoader";

interface CreateLoaderOptions<T> {
  retryAttempts: number;
  setState: (state: LoaderState<T>) => void;
  op: (attempt: number) => Operation<T>;
}

export function createLoader<T>({
  op, retryAttempts, setState,
}: CreateLoaderOptions<T>): () => Operation<void> {
  return function* main() {
    setState({
      type: "started",
    });

    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      const loader = yield* spawn(createSpinner({ setState }));

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
            type: "retrying",
            error,
          });
          yield* sleep(1000);
        }
      }

      yield* loader.halt();
    }
  };
}
