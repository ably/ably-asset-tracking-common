/**
 * Suspends program execution for `sleepTimeInSeconds` seconds.
 * Utility wrapper for setTimeout that makes it possible to call it in the async/await fashion.
 */
export const wait = (sleepTimeInSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, sleepTimeInSeconds * 1000));
