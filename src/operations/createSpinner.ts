/* eslint-disable react-hooks/rules-of-hooks */
import { Operation, sleep } from "effection";
import { useLoaderState } from "./LoaderStateContext";

export type CreateSpinnerOptions = {
  loadingInterval: number;
  loadingSlowlyInterval: number;
};

export function createSpinner({
  loadingInterval,
  loadingSlowlyInterval,
}: CreateSpinnerOptions) {
  return function* loadingSpinner(): Operation<void> {
    const state = yield* useLoaderState();

    let count = 0;
    while (true) {
      yield* state.send({
        type: "loading",
        count,
      });

      yield* sleep(loadingInterval);

      yield* state.send({
        type: "loading-slowly",
      });

      yield* sleep(loadingSlowlyInterval);
      count++;
    }
  };
}
