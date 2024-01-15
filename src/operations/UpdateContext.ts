import { Operation, createContext, lift } from "effection";
import { LoaderState } from "../hooks/useLoader";

export const UpdateContext = createContext<typeof update>("update");

export const update = function* update<T>(value: LoaderState<T>): Operation<void> {
  const setState = yield* UpdateContext;
  yield* setState(value);
}

export function* setUpdate(setState: (value: LoaderState<unknown>) => void): Operation<typeof update> {
  const lifted = lift(setState);
  yield* UpdateContext.set(lifted);
  return lifted;
}