import * as u from "@automerge/automerge";
import { C as f, P as y, b as m, T as P } from "./assets/index-DgM1U5km.js";
import { m as R } from "./assets/memoize-CPDYtx9i.js";
import { R as v, d as x } from "./assets/index-DHLbTQAO.js";
const p = (t) => t.length > 0 ? t[t.length - 1] : void 0, S = (t) => {
  const o = new v(t(f));
  return f.subscribe(() => {
    o.set(t(f));
  }), o;
}, A = Symbol("diff"), i = x("diff", A), T = (t, o) => {
  const r = [];
  if (!o || !t)
    return [];
  const h = u.view(t.doc(), o), w = t.doc(), k = u.diff(
    w,
    o,
    u.getHeads(w)
  ), b = /* @__PURE__ */ new Set();
  for (const e of k) {
    const g = typeof p(e.path) == "number" ? e.path.slice(0, -1) : e.path;
    for (let s = g.length; s > 0; s--) {
      const n = g.slice(0, s), a = JSON.stringify(n);
      if (b.has(a)) break;
      const c = new y(t, n), l = m(h, n);
      l ? r.push(c.with(i({ type: "changed", before: l }))) : r.push(c.with(i({ type: "added" }))), b.add(a);
    }
    const d = new y(t, e.path);
    switch (e.action) {
      case "put":
        r.push(d.with(i({ type: "added" })));
        break;
      case "del": {
        if (typeof p(e.path) == "number") {
          const s = e.path.slice(0, -1), n = m(h, s);
          if (console.log("position", p(e.path)), typeof n == "string") {
            const a = p(e.path), c = new P(
              t,
              s,
              a,
              a
            );
            r.push(c.with(i({ type: "deleted", before: "" })));
          } else throw Array.isArray(n) ? new Error("not implemented") : new Error("Unexpected value, this should never happen");
        } else {
          const s = m(h, e.path);
          r.push(d.with(i({ type: "deleted", before: s })));
        }
        break;
      }
      case "insert": {
        r.push(d.with(i({ type: "added" })));
        break;
      }
      case "splice":
        {
          const s = e.path.slice(0, -1), n = p(e.path), a = n + e.value.length, c = new P(t, s, n, a);
          r.push(c.with(i({ type: "added" })));
        }
        break;
    }
  }
  return r;
}, C = R(
  (t) => S(() => f.resolve(t).get(i)),
  (t) => t.toId()
), I = R(
  (t) => S(() => t ? f.refsWith(i).filter(
    (o) => o.isPartOf(t) && !o.isEqual(t)
  ) : []),
  (t) => t?.toId()
);
export {
  i as Diff,
  C as getDiff,
  T as getDiffOfDoc,
  I as getRefsWithDiffAt
};
