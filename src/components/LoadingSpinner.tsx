import { SpinnerCircular } from "spinners-react";
import { LoaderState } from "../hooks/useLoader";

export function LoadingSpinner({ loader }: { loader: LoaderState<unknown> }): JSX.Element {
  switch (loader.type) {
    case "loading":
      return (
        <>
          <SpinnerCircular size={30} thickness={300} />
          Loading...
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
        <p className="text-red-800">
          Encountered and error {loader.error.message}.
        </p>
      )
    case "retrying":
      return (
        <p className="text-red-800">
          Encountered and error {loader.error.message}. Retrying...
        </p>
      )
    case "success":
      return (
        <>{loader.value}</>
      )
  }

  return <></>
}
