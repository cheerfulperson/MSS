import React from "react";

type FN = <Props extends object = {}>(Component: React.ComponentType<Props>) => React.FC<Props>;

export const HOCs = <Props extends object = {}>(Component: React.ComponentType<Props>, ...fns: FN[]) => {
  return fns.reduce((acc, fn) => fn(acc), Component);
};
