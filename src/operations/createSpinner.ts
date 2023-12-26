import { Operation, sleep } from "effection";
import { LoaderState } from "../hooks/useLoader";

export interface SpinnerOptions<T> {
  setState: (state: LoaderState<T>) => void;
}

export function createSpinner<T>({ setState }: SpinnerOptions<T>) {
  return function* loadingSpinner(): Operation<void> {
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
  };
}
