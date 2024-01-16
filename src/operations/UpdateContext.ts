import { Operation, createContext, suspend } from "effection";
import { LoaderState } from "../hooks/useLoader";

export const UpdateContext = createContext<<T>(value: LoaderState<T>) => Operation<void>>("update");

export const update = function* update<T>(value: LoaderState<T>): Operation<void> {
  const send = yield* UpdateContext;
  yield* send(value);
  if (value.type === "stopped") {
    yield* suspend();
  }
}

export function* setUpdateContext(send: (value: LoaderState<unknown>) => Operation<void>): Operation<void> {
  yield* UpdateContext.set(send);
}