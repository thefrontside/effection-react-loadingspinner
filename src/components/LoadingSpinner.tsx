import { SpinnerCircular } from "spinners-react";
import { LoaderState } from "../hooks/useLoader";

export function LoadingSpinner({ loader }: { loader: LoaderState<unknown> }): JSX.Element {
  switch (loader.type) {
    case "loading":
      return (
        <>
          <SpinnerCircular size={30} thickness={300} />
          Loading
        </>
      );
    case "loading-slowly":
      return (
        <>
          <SpinnerCircular size={30} thickness={300} />
          It's taking longer than expected.
        </>
      );
    case "failed-attempt":
      return (
        <>
        </>
      )
  }
  return <></>
}
