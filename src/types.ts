
export type LoaderState<T> = {
  type: "started";
} |
{
  type: "loading";
  count: number;
} |
{
  type: "loading-slowly";
} |
{
  type: "success";
  value: T;
} |
{
  type: "failed-attempt";
  attempt: number;
  error: Error;
} |
{
  type: "retrying";
  error: Error;
} |
{
  type: "failed";
  error: Error;
};
