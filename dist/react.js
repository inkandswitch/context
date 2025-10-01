import { useMemo, useState, useEffect, useRef } from 'react';
import { C as CONTEXT } from './assets/index-CnahhtPs.js';

const useReactive = (reactiveOrFn) => {
  const reactive = useMemo(
    () => typeof reactiveOrFn === "function" ? reactiveOrFn() : reactiveOrFn,
    [reactiveOrFn]
  );
  const [value, setValue] = useState(reactive.value);
  useEffect(() => {
    const reactive2 = typeof reactiveOrFn === "function" ? reactiveOrFn() : reactiveOrFn;
    reactive2.on("change", setValue);
    return () => {
      reactive2.emit("destroy");
    };
  }, [reactiveOrFn]);
  return value;
};
const useSubcontext = () => {
  const [subcontext] = useState(() => CONTEXT.subcontext());
  const subcontextRef = useRef(subcontext);
  useEffect(() => {
    return () => {
      CONTEXT.remove(subcontextRef.current);
    };
  }, []);
  return subcontext;
};

export { useReactive, useSubcontext };
