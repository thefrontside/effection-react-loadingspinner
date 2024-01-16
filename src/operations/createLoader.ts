/* eslint-disable react-hooks/rules-of-hooks */
import { Operation, sleep, spawn, call, useAbortSignal } from "effection";
import { CreateSpinnerOptions, createSpinner } from "./createSpinner";
import { update } from "./UpdateContext";
import { LoaderFn } from "../hooks/useLoader";

export type CreateLoaderOptions<T> = {
  load: LoaderFn<T>;
  showSpinnerAfterInterval: number;
  retryAttempts: number;
  failedAttemptErrorInterval: number;
  retryingMessageInterval: number;
} & CreateSpinnerOptions;

export function createLoader<T>({
  load,
  retryAttempts,
  showSpinnerAfterInterval,
  loadingInterval,
  loadingSlowlyInterval,
  failedAttemptErrorInterval,
  retryingMessageInterval,
}: CreateLoaderOptions<T>): () => Operation<void> {
  return function* loader() {
    yield* update({
      type: "started",
    });

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      const spinner = yield* spawn(function* () {
        if (attempt === 0) {
          yield* sleep(showSpinnerAfterInterval);
        }
        yield* createSpinner({
          loadingInterval,
          loadingSlowlyInterval,
        })();
      });

      const signal = yield* useAbortSignal();

      try {
        const result = yield* call(() => load({ attempt, signal }));

        yield* update({
          type: "success",
          value: result,
        });

        break;
      } catch (e) {
        yield* spinner.halt();

        const error = e instanceof Error ? e : new Error(`${e}`);

        if (attempt === retryAttempts) {
          yield* update({
            type: "failed",
            error,
          });
        } else {
          yield* update({
            type: "failed-attempt",
            attempt,
            error,
          });
          yield* sleep(failedAttemptErrorInterval);
          yield* update({
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
