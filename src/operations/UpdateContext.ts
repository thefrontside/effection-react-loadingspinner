import { Operation, createContext, lift } from "effection";
import { LoaderState } from "../hooks/useLoader";

type Update<T> = (state: LoaderState<T>) => Operation<void>;

export const UpdateContext = createContext<Update<unknown>>("update");

export const update: Update<unknown> = function* update(value) {
  const setState = yield* UpdateContext;
  yield* setState(value);
}

export function* setUpdate(setState: (value: LoaderState<unknown>) => void): Operation<Update<unknown>> {
  const lifted = lift(setState);
  yield* UpdateContext.set(lifted);
  return lifted;
}