export type Type<T> = new (...args: any[]) => T;

export const log = (...params: unknown[]) => {
  // TODO: Maybe use webpack plugin to remove the whole call instead of just the log statement
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params);
  }
};

export const assertUnreachable = (neverCase: never): never => {
  throw new Error(
    `[Error][TornTools]: Did you forget to handle the case ${neverCase}?`
  );
};
