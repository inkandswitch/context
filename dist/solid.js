import { createMemo, createSignal, createEffect, onCleanup } from 'solid-js';
import { C as CONTEXT } from './assets/index-CIxD3AZv.js';

const createReactive = (reactiveOrFn) => {
  const reactive = createMemo(
    () => typeof reactiveOrFn === "function" ? reactiveOrFn() : reactiveOrFn
  );
  const [value, setValue] = createSignal(reactive().value);
  createEffect(() => {
    const currentReactive = reactive();
    const handleChange = (newValue) => setValue(() => newValue);
    currentReactive.on("change", handleChange);
    onCleanup(() => {
      currentReactive.emit("destroy");
      currentReactive.off("change", handleChange);
    });
  });
  return value;
};
const createSubcontext = () => {
  const subcontext = CONTEXT.subcontext();
  onCleanup(() => {
    CONTEXT.remove(subcontext);
  });
  return subcontext;
};

export { createReactive, createSubcontext };
