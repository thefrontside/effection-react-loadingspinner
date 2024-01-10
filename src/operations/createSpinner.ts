import { Operation, sleep } from "effection";
import { UpdateFnContext } from "./UpdateFnContext";

export function createSpinner() {
  return function* loadingSpinner(): Operation<void> {
    const update = yield* UpdateFnContext;

    yield* sleep(1000);

    let count = 0;
    while (true) {
      update({
        type: "loading",
        count,
      });

      yield* sleep(3000);

      update({
        type: "loading-slowly",
      });

      yield* sleep(4000);
      count++;
    }
  };
}
