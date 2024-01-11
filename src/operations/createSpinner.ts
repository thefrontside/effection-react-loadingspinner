import { Operation, sleep } from "effection";
import { UpdateFnContext } from "./UpdateFnContext";

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
    const update = yield* UpdateFnContext;

    yield* sleep(showSpinnerAfterInterval);

    let count = 0;
    while (true) {
      update({
        type: "loading",
        count,
      });

      yield* sleep(loadingInterval);

      update({
        type: "loading-slowly",
      });

      yield* sleep(loadingSlowlyInterval);
      count++;
    }
  };
}
