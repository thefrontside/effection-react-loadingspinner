import { Operation, sleep } from "effection";
import { update } from "./UpdateContext";

export type CreateSpinnerOptions = {
  loadingInterval: number;
  loadingSlowlyInterval: number;
};

export function createSpinner({
  loadingInterval,
  loadingSlowlyInterval,
}: CreateSpinnerOptions) {
  return function* loadingSpinner(): Operation<void> {
    let count = 0;
    while (true) {
      yield* update({
        type: "loading",
        count,
      });

      yield* sleep(loadingInterval);

      yield* update({
        type: "loading-slowly",
      });

      yield* sleep(loadingSlowlyInterval);
      count++;
    }
  };
}
