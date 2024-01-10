import { createContext } from "effection";
import { LoaderState } from "../hooks/useLoader";

export type UpdateFn = (state: LoaderState<unknown>) => void;

export const UpdateFnContext = createContext<UpdateFn>("updateFn");