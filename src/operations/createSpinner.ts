import { Operation, sleep } from "effection";
import { update } from "./UpdateContext";

export type CreateSpinnerOptions = {
  showSpinnerAfterInterval: number;
  loadingInterval: number;
  loadingSlowlyInterval: number;
};

export function createSpinner({
  showSpinnerAfterInterval,
  loadingInterval,
  loadingSlowlyInterval,
}: CreateSpinnerOptions) {
  return function* loadingSpinner(): Operation<void> {
    yield* sleep(showSpinnerAfterInterval);

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
