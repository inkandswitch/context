import * as u from "@automerge/automerge";
import { b as R, C as f, d as x, P as y, c as w, T as P } from "./assets/index-nzPPvs9h.js";
import { m as S } from "./assets/memoize-CPDYtx9i.js";
const p = (t) => t.length > 0 ? t[t.length - 1] : void 0, k = (t) => {
  const o = new R(t(f));
  return f.subscribe(() => {
    o.set(t(f));
  }), o;
}, A = Symbol("diff"), i = x("diff", A), O = (t, o) => {
  const r = [];
  if (!o || !t)
    return [];
  const h = u.view(t.doc(), o), b = t.doc(), v = u.diff(
    b,
    o,
    u.getHeads(b)
  ), m = /* @__PURE__ */ new Set();
  for (const e of v) {
    const g = typeof p(e.path) == "number" ? e.path.slice(0, -1) : e.path;
    for (let s = g.length; s > 0; s--) {
      const n = g.slice(0, s), a = JSON.stringify(n);
      if (m.has(a)) break;
      const c = new y(t, n), l = w(h, n);
      l ? r.push(c.with(i({ type: "changed", before: l }))) : r.push(c.with(i({ type: "added" }))), m.add(a);
    }
    const d = new y(t, e.path);
    switch (e.action) {
      case "put":
        r.push(d.with(i({ type: "added" })));
        break;
      case "del": {
        if (typeof p(e.path) == "number") {
          const s = e.path.slice(0, -1), n = w(h, s);
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
          const s = w(h, e.path);
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
}, T = S(
  (t) => k(() => f.resolve(t).get(i)),
  (t) => t.toId()
), C = S(
  (t) => k(() => t ? f.refsWith(i).filter(
    (o) => o.isPartOf(t) && !o.isEqual(t)
  ) : []),
  (t) => t?.toId()
);
export {
  i as Diff,
  T as getDiff,
  O as getDiffOfDoc,
  C as getRefsWithDiffAt
};
