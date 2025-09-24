import { useMemo as m, useState as s, useEffect as n, useRef as p } from "react";
import { C as u } from "./assets/index-DgM1U5km.js";
const b = (t) => {
  const e = m(
    () => typeof t == "function" ? t() : t,
    [t]
  ), [c, f] = s(e.value);
  return n(() => {
    const o = typeof t == "function" ? t() : t;
    return o.on("change", f), () => {
      o.emit("destroy");
    };
  }, [t]), c;
}, l = () => {
  const [t] = s(() => u.subcontext()), e = p(t);
  return n(() => () => {
    u.remove(e.current);
  }, []), t;
};
export {
  b as useReactive,
  l as useSubcontext
};
