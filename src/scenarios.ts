import { Operation, sleep } from "effection";

export const scenarios: Scenario[] = [
  {
    title: "Noop",
    description: "Reset",
    run: function* (): Operation<string> {
      return "";
    },
  },
  {
    title: "Succeeds immidiately",
    description: "Loading spinner is not visible",
    run: function* (): Operation<string> {
      return "Hello World";
    },
  },
  {
    title: "Succeeds after 2s",
    description: "Loading spinner is visible for 1 second, then shows Done!",
    run: function* (): Operation<string> {
      yield* sleep(2000);

      return "Done!";
    },
  },
];

export interface Scenario {
  title: string;
  description: string;
  run: () => Operation<string>;
}
