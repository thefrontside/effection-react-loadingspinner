import { Channel, createChannel, createContext, resource } from "effection";
import { LoaderState } from "../types";

export const LoaderStateContext =
  createContext<Channel<LoaderState<unknown>, void>>("loader-state");

export function* initLoaderStateContext() {
  const state = yield* resource<Channel<LoaderState<unknown>, void>>(function* (provide) {
    const channel = createChannel<LoaderState<unknown>>();

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