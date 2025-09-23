import { d as r, b as d, C as c } from "./assets/index-nzPPvs9h.js";
const S = Symbol("IsSelected"), l = r(
  "IsSelected",
  S
), m = () => {
  const e = new d({
    isSelected: () => !1,
    setSelection: () => {
    },
    selectedRefs: []
  }), t = c.subcontext(), i = () => {
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
  return c.subscribe(i), e.on("destroy", () => {
    c.remove(t);
  }), e;
};
export {
  m as SelectionAPI
};
