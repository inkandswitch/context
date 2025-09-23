import { useMemo as f, useState as n, useEffect as c } from "react";
const p = (o) => {
  const e = f(
    () => typeof o == "function" ? o() : o,
    [o]
  ), [u, s] = n(e.value);
  return c(() => {
    const t = typeof o == "function" ? o() : o;
    return t.on("change", s), () => {
      t.emit("destroy");
    };
  }, [o]), u;
};
export {
  p as useReactive
};
