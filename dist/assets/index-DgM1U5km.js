import * as l from "@automerge/automerge";
function d(n, t) {
  if (n === t) return !0;
  if (n == null || t == null) return n === t;
  const e = typeof n, s = typeof t;
  if (e !== s) return !1;
  if (Array.isArray(n) && Array.isArray(t)) {
    if (n.length !== t.length) return !1;
    for (let r = 0; r < n.length; r++)
      if (!d(n[r], t[r])) return !1;
    return !0;
  }
  if (e === "object" && s === "object") {
    const r = n, h = t, i = Object.keys(r), u = Object.keys(h);
    if (i.length !== u.length) return !1;
    i.sort(), u.sort();
    for (let a = 0; a < i.length; a++) {
      if (i[a] !== u[a]) return !1;
      const w = i[a];
      if (!d(r[w], h[w])) return !1;
    }
    return !0;
  }
  return !1;
}
const g = (n, t) => {
  let e = n;
  for (const s of t)
    if (e = e[s], e === void 0)
      return;
  return e;
}, o = Symbol("fields");
class y {
  [o] = /* @__PURE__ */ new Map();
  docHandle;
  path;
  constructor(t, e) {
    this.docHandle = t, this.path = e;
  }
  // ==== value methods ====
  get value() {
    return this.resolve(this.docHandle.doc());
  }
  valueAt(t) {
    return this.resolve(l.view(this.docHandle.doc(), t));
  }
  // todo: this is not right
  // the method should only be available if the value is a string
  slice(t, e) {
    return new c(this.docHandle, this.path, t, e);
  }
  get docRef() {
    return new f(this.docHandle, []);
  }
  get docUrl() {
    return this.docHandle.url;
  }
  // ==== mutation methods ====
  change(t) {
    this.docHandle.change((e) => {
      const s = this.resolve(e);
      s && t(s);
    });
  }
  // ==== ref arithmetic methods ====
  isEqual(t) {
    return this.toId() === t.toId();
  }
  doesOverlap(t) {
    return this.toId() === t.toId();
  }
  isPartOf(t) {
    if (t.docHandle !== this.docHandle || t.path.length > this.path.length)
      return !1;
    for (let e = 0; e < t.path.length; e++)
      if (this.path[e] !== t.path[e])
        return !1;
    return !0;
  }
  // ==== field methods ====
  with(t) {
    const e = this.clone();
    return e[o] = new Map(this[o]), e[o].set(t.type, t.value), e;
  }
  get(t) {
    return this[o].get(t.type);
  }
  has(t) {
    return this[o].has(t.type);
  }
  get fields() {
    return Array.from(this[o].entries());
  }
}
class f extends y {
  constructor(t, e) {
    super(t, e);
  }
  resolve(t) {
    return g(t, this.path);
  }
  toId() {
    const t = this.docHandle.url, e = JSON.stringify(this.path);
    return `${t}:${e}`;
  }
  clone() {
    return new f(this.docHandle, this.path);
  }
  serialize() {
    return { type: "path", path: this.path };
  }
}
class m extends y {
  #e;
  #t;
  constructor(t, e, s, r) {
    super(t, e), this.#e = s, this.#t = r;
  }
  resolve(t) {
    return g(t, this.path).find((s) => s[this.#t] === this.#e);
  }
  toId() {
    return this.#e;
  }
  clone() {
    return new m(this.docHandle, this.path, this.#e, this.#t);
  }
  serialize() {
    return {
      type: "id",
      path: this.path,
      id: this.#e,
      key: this.#t
    };
  }
}
class c extends y {
  #e;
  #t;
  constructor(t, e, s, r) {
    super(t, e);
    const h = t.doc();
    this.#e = typeof s == "number" ? l.getCursor(h, e, s) : s, this.#t = typeof r == "number" ? l.getCursor(h, e, r) : r;
  }
  get from() {
    return l.getCursorPosition(
      this.docHandle.doc(),
      this.path,
      this.#e
    );
  }
  get to() {
    return l.getCursorPosition(
      this.docHandle.doc(),
      this.path,
      this.#t
    );
  }
  resolve(t) {
    const e = l.getCursorPosition(t, this.path, this.#e), s = l.getCursorPosition(t, this.path, this.#t);
    return g(t, this.path).slice(e, s);
  }
  toId() {
    return `${this.#e}:${this.#t}`;
  }
  doesOverlap(t) {
    if (!(t instanceof c) || this.docHandle !== t.docHandle || this.path.length !== t.path.length)
      return !1;
    for (let i = 0; i < this.path.length; i++)
      if (this.path[i] !== t.path[i]) return !1;
    const e = Math.min(this.from, this.to), s = Math.max(this.from, this.to), r = Math.min(t.from, t.to), h = Math.max(t.from, t.to);
    return s > r && h > e;
  }
  slice(t, e) {
    return new c(
      this.docHandle,
      this.path,
      this.from + t,
      this.from + e
    );
  }
  // todo: figure out what to do here
  // we could implement a mutable string here but that feels bad
  change(t) {
    throw new Error("not implemented");
  }
  clone() {
    return new c(this.docHandle, this.path, this.from, this.to);
  }
  serialize() {
    return {
      type: "text-span",
      path: this.path,
      from: this.#e,
      to: this.#t
    };
  }
}
const H = (n, t) => {
  switch (t.type) {
    case "path":
      return new f(n, t.path);
    case "id":
      return new m(n, t.path, t.id, t.key);
    case "text-span":
      return new c(n, t.path, t.from, t.to);
  }
};
class v {
  #e = /* @__PURE__ */ new Set();
  #t = /* @__PURE__ */ new Map();
  #s = /* @__PURE__ */ new Set();
  constructor() {
  }
  // ==== mutation methods ====
  add(t) {
    p(this.#t, t), this.#r();
  }
  replace(t) {
    const e = /* @__PURE__ */ new Map();
    p(e, t), !b(this.#t, e) && (this.#t = e, this.#r());
  }
  // ==== query methods ====
  resolve(t) {
    const e = t.clone(), s = /* @__PURE__ */ new Map();
    return e[o] = s, this.#n(e), e;
  }
  #n(t) {
    const e = this.#t.get(t.toId());
    if (e)
      for (const [s, r] of e[o].entries())
        t[o].set(s, r);
    for (const s of this.#s)
      s.#n(t);
  }
  get refs() {
    const t = /* @__PURE__ */ new Map();
    return this.#o(t), Array.from(t.values());
  }
  #o(t) {
    for (const e of this.#t.values()) {
      const s = e.toId();
      let r = t.get(s);
      r || (r = e.clone(), t.set(s, r));
      for (const [h, i] of e[o].entries())
        r[o].set(h, i);
    }
    for (const e of this.#s)
      e.#o(t);
  }
  refsWith(t) {
    return this.refs.filter(
      (e) => e.has(t)
    );
  }
  // ==== subscription methods ====
  #r = () => {
    this.#e.forEach((t) => t());
  };
  subscribe(t) {
    this.#e.add(t);
  }
  unsubscribe(t) {
    this.#e.delete(t);
  }
  // ==== subcontext methods ====
  subcontext() {
    const t = new v();
    return t.subscribe(this.#r), this.#s.add(t), t;
  }
  remove(t) {
    t.unsubscribe(this.#r), this.#s.delete(t);
  }
}
const p = (n, t) => {
  if (Array.isArray(t)) {
    for (const s of t)
      p(n, s);
    return;
  }
  let e = n.get(t.toId());
  e || (e = t.clone(), n.set(t.toId(), e));
  for (const [s, r] of t[o].entries())
    e[o].set(s, r);
}, b = (n, t) => {
  if (n.size !== t.size)
    return !1;
  for (const e of n.values()) {
    const s = t.get(e.toId());
    if (!s)
      return !1;
    const r = e[o], h = s[o];
    if (r.size !== h.size)
      return !1;
    for (const [i, u] of r.entries()) {
      const a = h.get(i);
      if (!a || !d(u, a))
        return !1;
    }
  }
  return !0;
}, A = new v();
export {
  o as $,
  A as C,
  m as I,
  f as P,
  y as R,
  c as T,
  v as a,
  g as b,
  H as l
};
