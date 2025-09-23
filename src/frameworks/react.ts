import { useEffect, useMemo, useRef, useState } from "react";
import { Reactive } from "../reactive";
import { CONTEXT } from "../core";
import { Context } from "../core/context";

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

export const useSubcontext = () => {
  const [subcontext] = useState<Context>(() => CONTEXT.subcontext());
  const subcontextRef = useRef<Context>(subcontext);

  useEffect(() => {
    return () => {
      CONTEXT.remove(subcontextRef!.current);
    };
  }, []);

  return subcontext;
};
