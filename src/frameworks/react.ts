import { useEffect, useMemo, useState } from "react";
import { Reactive } from "../reactive";

export const useReactive = <T>(
  reactiveOrFn: Reactive<T> | (() => Reactive<T>)
): T => {
  const reactive = useMemo(
    () => (typeof reactiveOrFn === "function" ? reactiveOrFn() : reactiveOrFn),
    [reactiveOrFn]
  );

  const [value, setValue] = useState(reactive.value);

  useEffect(() => {
    const reactive =
      typeof reactiveOrFn === "function" ? reactiveOrFn() : reactiveOrFn;

    reactive.on("change", setValue);

    return () => {
      reactive.emit("destroy");
    };
  }, [reactiveOrFn]);

  return value;
};
