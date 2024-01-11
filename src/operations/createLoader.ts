/* eslint-disable react-hooks/rules-of-hooks */
import { Operation, sleep, spawn, call, useAbortSignal } from "effection";
import { CreateSpinnerOptions, createSpinner } from "./createSpinner";
import { UpdateFnContext } from "./UpdateFnContext";
import { LoaderFn } from "../hooks/useLoader";

type CreateLoaderOptions<T> = {
  load: LoaderFn<T>;
  retryAttempts: number;
  failedAttemptErrorInterval: number;
  retryingMessageInterval: number;
} & CreateSpinnerOptions;

export function createLoader<T>({
  load,
  retryAttempts,
  showSpinnerAfterInterval = 1000,
  loadingInterval = 3000,
  loadingSlowlyInterval = 4000,
  failedAttemptErrorInterval = 1000,
  retryingMessageInterval = 1000,
}: CreateLoaderOptions<T>): () => Operation<void> {
  return function* loader() {
    const update = yield* UpdateFnContext;

    update({
      type: "started",
    });

    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      const spinner = yield* spawn(
        createSpinner({
          showSpinnerAfterInterval,
          loadingInterval,
          loadingSlowlyInterval,
        })
      );

      const signal = yield* useAbortSignal();

      try {
        const result = yield* call(() => load({ attempt, signal }));

        update({
          type: "success",
          value: result,
        });

        break;
      } catch (e) {
        yield* spinner.halt();

        const error = e instanceof Error ? e : new Error(`${e}`);

        if (attempt + 1 === retryAttempts) {
          update({
            type: "failed",
            error,
          });
        } else {
          update({
            type: "failed-attempt",
            error,
          });
          yield* sleep(failedAttemptErrorInterval);
          update({
            type: "retrying",
            error,
          });
          yield* sleep(retryingMessageInterval);
        }
      } finally {
        yield* spinner.halt();
      }
    }
  };
}
