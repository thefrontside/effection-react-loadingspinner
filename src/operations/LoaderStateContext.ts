import { Channel, createChannel, createContext, resource } from "effection";
import { LoaderState } from "../types";

export const LoaderStateContext =
  createContext<Channel<LoaderState<unknown>, void>>("loader-state");

export function* initLoaderStateContext<T>() {
  const state = yield* resource<Channel<LoaderState<T>, void>>(function* (provide) {
    const channel = createChannel<LoaderState<T>>();

    try {
      yield* provide(channel);
    } finally {
      yield* channel.close();
    }
  });

  yield* LoaderStateContext.set(state);
}

export function* useLoaderState() {
  const state = yield* LoaderStateContext;

  return state;
}