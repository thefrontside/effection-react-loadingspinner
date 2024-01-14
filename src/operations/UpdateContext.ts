import { Operation, createContext } from "effection";
import { LoaderState } from "../hooks/useLoader";

type Update = (state: LoaderState<any>) => Operation<void>;

export const UpdateContext = createContext<Update>("update");

export function* update<T>(state: LoaderState<T>): Operation<void> {
  let setState = yield* UpdateContext;
  yield* setState(state);
}
