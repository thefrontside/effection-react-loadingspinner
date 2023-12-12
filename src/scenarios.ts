import { Operation, sleep } from "effection";

export const scenarios: Scenario[] = [
  {
    title: "Succeeds immidiately",
    description: "Loading spinner is not visible",
    run: function* (): Operation<string> {
      return "Great Success!!!";
    },
  },
  {
    title: "Succeeds after 2 seconds",
    description: "Shows loading spinner after 1 second, then shows the result",
    run: function* (): Operation<string> {
      yield* sleep(2000);

      return "Great Success!!!";
    },
  },
  {
    title: "Succeeds after 9 seconds",
    description:
      "Shows loading spinner after 1 second, then show spinner for 4s, then shows longer than expected message for 4 seconds, then back to loading spinner, then the result",
    run: function* (): Operation<string> {
      yield* sleep(9000);

      return "Great Success!!!"
    }
  },
  {
    title: "Fail after 4 seconds, succeed on second attempt after 2 seconds",
    description: "Shows loading spinner after 1 second, show loading spinner for 3 seconds, show error for 3 second, restart and succeed after 2 seconds.",
    run: function* (attempt: number): Operation<string> {
      switch (attempt) {
        case 0:
          yield* sleep(4000);
          throw new Error(`Could not get the value`)
        case 1:
          yield* sleep(2000);
      }
      return "Great Success!!!"
    }
  },
  {
    title: "Fail twice, taking progressively longer with each, succeed on third attempt",
    description: "Shows loading spinner, then fails, shows retrying, then show loading spinner with taking too long, then fails, then tries again and succeeds.",
    run: function*(attempt: number): Operation<string> {
      switch (attempt) {
        case 0:
          yield* sleep(2000);

          throw new Error(`Failed to connect to external service`)
        case 1:
          yield* sleep(6000);
          
          throw new Error(`Connection timed out`);
        case 2:
          yield* sleep(2000);
      }
      return 'Great Success!!!'
    }
  },
  {
    title: "Fails 3 times in 500ms each",
    description: "",
    run: function*(): Operation<string> {
      yield* sleep(500);
      
      throw new Error(`Could not connnect to the server`);
    }
  }
];

export interface Scenario {
  title: string;
  description: string;
  run: (attempt: number) => Operation<string>;
}
