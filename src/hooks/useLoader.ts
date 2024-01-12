import { useMemo, useEffect, useState, useCallback } from "react";
import { run, type Callable } from "effection";
import { CreateLoaderOptions, createLoader } from "../operations/createLoader";
import { setUpdate } from "../operations/UpdateContext";

export type LoaderState<T> =
  | {
      type: "initial";
    }
  | {
      type: "started";
    }
  | {
      type: "loading";
      count: number;
    }
  | {
      type: "loading-slowly";
    }
  | {
      type: "success";
      value: T;
    }
  | {
      type: "failed-attempt";
      error: Error;
    }
  | {
      type: "retrying";
      error: Error;
    }
  | {
      type: "failed";
      error: Error;
    };

export type LoaderFn<T> = (params: {
  attempt: number;
  signal: AbortSignal;
}) => Callable<T>;

export type UseLoaderOptions<T> = Partial<Omit<CreateLoaderOptions<T>, "load">>;

export function useLoader<T>(
  load: LoaderFn<T>,
  options: UseLoaderOptions<T> = {}
) {
  const {
    retryAttempts = 3,
    showSpinnerAfterInterval = 1000,
    loadingInterval = 3000,
    loadingSlowlyInterval = 4000,
    failedAttemptErrorInterval = 1000,
    retryingMessageInterval = 1000,
  } = options;

  const [state, setState] = useState<LoaderState<unknown>>({ type: "initial" });
  const [key, setKey] = useState<number>(0);

  const restart = useCallback(() => {
    setKey(key + 1);
  }, [key, setKey]);

  const loader = useMemo(
    () =>
      createLoader({
        retryAttempts,
        load,
        showSpinnerAfterInterval,
        loadingInterval,
        loadingSlowlyInterval,
        failedAttemptErrorInterval,
        retryingMessageInterval,
      }),
    [
      failedAttemptErrorInterval,
      load,
      loadingInterval,
      loadingSlowlyInterval,
      retryAttempts,
      retryingMessageInterval,
      showSpinnerAfterInterval,
    ]
  );

  useEffect(() => {
    const task = run(function* () {
      const update = yield* setUpdate(setState);
      yield* update({ type: "initial" })
      yield* loader();
    });

    return () => {
      run(() => task.halt());

    };
  }, [loader, key]);

  return [state, { restart }] as const;
}
