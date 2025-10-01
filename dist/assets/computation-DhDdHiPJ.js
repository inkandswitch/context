import { R as Reactive } from './index-uxx6B13V.js';
import { C as CONTEXT } from './index-CnahhtPs.js';

const contextComputation = (computation) => {
  const api = new Reactive(computation(CONTEXT));
  CONTEXT.subscribe(() => {
    api.set(computation(CONTEXT));
  });
  return api;
};

export { contextComputation as c };
