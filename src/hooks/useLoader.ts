import { run, spawn, type Callable } from "effection";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  initLoaderStateContext,
  useLoaderState,
} from "../operations/LoaderStateContext";
import { CreateLoaderOptions, createLoader } from "../operations/createLoader";
import { LoaderState } from "../types";

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

  const [state, setState] = useState<LoaderState<T>>({ type: "initial" });
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
      yield* initLoaderStateContext<T>();

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const state = yield* useLoaderState();

      const subscription = yield* state;

      yield* spawn(loader);

      let next = yield* subscription.next();

      while (!next.done) {
        setState(next.value);
        next = yield* subscription.next();
      }
    });

    return () => {
      run(() => task.halt());
    };
  }, [loader, key]);

  return [state, { restart }] as const;
}
