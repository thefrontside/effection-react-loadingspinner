/* eslint-disable react-hooks/rules-of-hooks */
import { Operation, sleep, spawn, call, useAbortSignal } from "effection";
import { createSpinner } from "./createSpinner";
import { UpdateFnContext } from "./UpdateFnContext";
import { LoaderFn } from "../hooks/useLoader";

interface CreateLoaderOptions<T> {
  load: LoaderFn<T>;
  retryAttempts: number;
}

export function createLoader<T>({
  load,
  retryAttempts,
}: CreateLoaderOptions<T>): () => Operation<void> {
  return function* loader() {
    const update = yield* UpdateFnContext;

    update({
      type: "started",
    });

    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      const spinner = yield* spawn(createSpinner());

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
          yield* sleep(1000);
          update({
            type: "retrying",
            error,
          });
          yield* sleep(1000);
        }
      } finally {
        yield* spinner.halt();
      }
    }
  };
}
