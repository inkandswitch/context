import { d as i, R as d } from "./assets/index-DHLbTQAO.js";
import { C as c } from "./assets/index-Dehu0T3X.js";
const S = Symbol("IsSelected"), l = i(
  "IsSelected",
  S
), f = () => {
  const e = new d({
    isSelected: () => !1,
    setSelection: () => {
    },
    selectedRefs: []
  }), t = c.subcontext(), r = () => {
    const n = t.refsWith(l);
    e.set({
      selectedRefs: n,
      isSelected(s) {
        return n.some((o) => o.doesOverlap(s));
      },
      setSelection(s) {
        t.replace(s.map((o) => o.with(l(!0))));
      }
    });
  };
  return c.subscribe(r), e.on("destroy", () => {
    c.remove(t);
  }), e;
};
export {
  f as SelectionAPI
};
