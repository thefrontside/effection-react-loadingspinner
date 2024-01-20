import { SpinnerCircular } from "spinners-react";
import { LoaderState } from "../types";

export function LoadingSpinner({ loader }: { loader: LoaderState<unknown> }): JSX.Element {
  switch (loader.type) {
    case "loading":
      return (
        <div className="flex">
          <SpinnerCircular size={30} thickness={300} />
          <span className="ml-2">{loader.count === 0 ? "Loading..." : "Still loading..."}</span>
        </div>
      );
    case "loading-slowly":
      return (
        <div className="flex">
          <SpinnerCircular size={30} thickness={300} />
          <span className="ml-2">It's taking longer than expected.</span>
        </div>
      );
    case "failed-attempt":
      return (
        <p className="text-red-800">
          Encountered and error: {loader.error.message}.
        </p>
      )
    case "retrying":
      return (
        <p className="text-red-800">
          Retrying...
        </p>
      )
    case "success":
      return (
        <p className="text-green-800">{`${loader.value}`}</p>
      )
    case "failed":
      return (
        <p className="text-red-800">
          Failed after 3 attempts. Please contact support.
        </p>
      )
  }

  return <></>
}
