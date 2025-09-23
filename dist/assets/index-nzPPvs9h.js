import * as x from "@automerge/automerge";
function O(o, t) {
  if (o === t) return !0;
  if (o == null || t == null) return o === t;
  const e = typeof o, s = typeof t;
  if (e !== s) return !1;
  if (Array.isArray(o) && Array.isArray(t)) {
    if (o.length !== t.length) return !1;
    for (let h = 0; h < o.length; h++)
      if (!O(o[h], t[h])) return !1;
    return !0;
  }
  if (e === "object" && s === "object") {
    const h = o, y = t, p = Object.keys(h), u = Object.keys(y);
    if (p.length !== u.length) return !1;
    p.sort(), u.sort();
    for (let a = 0; a < p.length; a++) {
      if (p[a] !== u[a]) return !1;
      const n = p[a];
      if (!O(h[n], y[n])) return !1;
    }
    return !0;
  }
  return !1;
}
const H = (o, t) => {
  let e = o;
  for (const s of t)
    if (e = e[s], e === void 0)
      return;
  return e;
}, v = Symbol("fields");
class I {
  [v] = /* @__PURE__ */ new Map();
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
    return this.resolve(x.view(this.docHandle.doc(), t));
  }
  // todo: this is not right
  // the method should only be available if the value is a string
  slice(t, e) {
    return new _(this.docHandle, this.path, t, e);
  }
  get docRef() {
    return new A(this.docHandle, []);
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
    return e[v] = new Map(this[v]), e[v].set(t.type, t.value), e;
  }
  get(t) {
    return this[v].get(t.type);
  }
  has(t) {
    return this[v].has(t.type);
  }
  get fields() {
    return Array.from(this[v].entries());
  }
}
class A extends I {
  constructor(t, e) {
    super(t, e);
  }
  resolve(t) {
    return H(t, this.path);
  }
  toId() {
    const t = this.docHandle.url, e = JSON.stringify(this.path);
    return `${t}:${e}`;
  }
  clone() {
    return new A(this.docHandle, this.path);
  }
  serialize() {
    return { type: "path", path: this.path };
  }
}
class j extends I {
  #t;
  #e;
  constructor(t, e, s, h) {
    super(t, e), this.#t = s, this.#e = h;
  }
  resolve(t) {
    return H(t, this.path).find((s) => s[this.#e] === this.#t);
  }
  toId() {
    return this.#t;
  }
  clone() {
    return new j(this.docHandle, this.path, this.#t, this.#e);
  }
  serialize() {
    return {
      type: "id",
      path: this.path,
      id: this.#t,
      key: this.#e
    };
  }
}
class _ extends I {
  #t;
  #e;
  constructor(t, e, s, h) {
    super(t, e);
    const y = t.doc();
    this.#t = typeof s == "number" ? x.getCursor(y, e, s) : s, this.#e = typeof h == "number" ? x.getCursor(y, e, h) : h;
  }
  get from() {
    return x.getCursorPosition(
      this.docHandle.doc(),
      this.path,
      this.#t
    );
  }
  get to() {
    return x.getCursorPosition(
      this.docHandle.doc(),
      this.path,
      this.#e
    );
  }
  resolve(t) {
    const e = x.getCursorPosition(t, this.path, this.#t), s = x.getCursorPosition(t, this.path, this.#e);
    return H(t, this.path).slice(e, s);
  }
  toId() {
    return `${this.#t}:${this.#e}`;
  }
  doesOverlap(t) {
    if (!(t instanceof _) || this.docHandle !== t.docHandle || this.path.length !== t.path.length)
      return !1;
    for (let p = 0; p < this.path.length; p++)
      if (this.path[p] !== t.path[p]) return !1;
    const e = Math.min(this.from, this.to), s = Math.max(this.from, this.to), h = Math.min(t.from, t.to), y = Math.max(t.from, t.to);
    return s > h && y > e;
  }
  slice(t, e) {
    return new _(
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
    return new _(this.docHandle, this.path, this.from, this.to);
  }
  serialize() {
    return {
      type: "text-span",
      path: this.path,
      from: this.#t,
      to: this.#e
    };
  }
}
const T = (o, t) => {
  switch (t.type) {
    case "path":
      return new A(o, t.path);
    case "id":
      return new j(o, t.path, t.id, t.key);
    case "text-span":
      return new _(o, t.path, t.from, t.to);
  }
};
class M {
  #t = /* @__PURE__ */ new Set();
  #e = /* @__PURE__ */ new Map();
  #n = /* @__PURE__ */ new Set();
  constructor() {
    setInterval(() => {
      this.#s();
    }, 100);
  }
  // ==== mutation methods ====
  add(t) {
    k(this.#e, t), this.#s();
  }
  replace(t) {
    const e = /* @__PURE__ */ new Map();
    k(e, t), !R(this.#e, e) && (this.#e = e, this.#s());
  }
  // ==== query methods ====
  resolve(t) {
    const e = t.clone(), s = /* @__PURE__ */ new Map();
    return e[v] = s, this.#r(e), e;
  }
  #r(t) {
    const e = this.#e.get(t.toId());
    if (e)
      for (const [s, h] of e[v].entries())
        t[v].set(s, h);
    for (const s of this.#n)
      s.#r(t);
  }
  get refs() {
    const t = /* @__PURE__ */ new Map();
    return this.#o(t), Array.from(t.values());
  }
  #o(t) {
    for (const e of this.#e.values()) {
      const s = e.toId();
      let h = t.get(s);
      h || (h = e.clone(), t.set(s, h));
      for (const [y, p] of e[v].entries())
        h[v].set(y, p);
    }
    for (const e of this.#n)
      e.#o(t);
  }
  refsWith(t) {
    return this.refs.filter(
      (e) => e.has(t)
    );
  }
  // ==== subscription methods ====
  #s = () => {
    this.#t.forEach((t) => t());
  };
  subscribe(t) {
    this.#t.add(t);
  }
  unsubscribe(t) {
    this.#t.delete(t);
  }
  // ==== subcontext methods ====
  subcontext() {
    const t = new M();
    return t.subscribe(this.#s), this.#n.add(t), t;
  }
  remove(t) {
    t.unsubscribe(this.#s), this.#n.delete(t);
  }
}
const k = (o, t) => {
  if (Array.isArray(t)) {
    for (const s of t)
      k(o, s);
    return;
  }
  let e = o.get(t.toId());
  e || (e = t.clone(), o.set(t.toId(), e));
  for (const [s, h] of t[v].entries())
    e[v].set(s, h);
}, R = (o, t) => {
  if (o.size !== t.size)
    return !1;
  for (const e of o.values()) {
    const s = t.get(e.toId());
    if (!s)
      return !1;
    const h = e[v], y = s[v];
    if (h.size !== y.size)
      return !1;
    for (const [p, u] of h.entries()) {
      const a = y.get(p);
      if (!a || !O(u, a))
        return !1;
    }
  }
  return !0;
}, N = (o, t) => Object.assign(
  (e) => ({ value: e, type: t, name: o }),
  { fieldName: o, type: t }
), B = new M();
function z(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var C = { exports: {} }, P;
function S() {
  return P || (P = 1, (function(o) {
    var t = Object.prototype.hasOwnProperty, e = "~";
    function s() {
    }
    Object.create && (s.prototype = /* @__PURE__ */ Object.create(null), new s().__proto__ || (e = !1));
    function h(a, n, i) {
      this.fn = a, this.context = n, this.once = i || !1;
    }
    function y(a, n, i, c, g) {
      if (typeof i != "function")
        throw new TypeError("The listener must be a function");
      var d = new h(i, c || a, g), l = e ? e + n : n;
      return a._events[l] ? a._events[l].fn ? a._events[l] = [a._events[l], d] : a._events[l].push(d) : (a._events[l] = d, a._eventsCount++), a;
    }
    function p(a, n) {
      --a._eventsCount === 0 ? a._events = new s() : delete a._events[n];
    }
    function u() {
      this._events = new s(), this._eventsCount = 0;
    }
    u.prototype.eventNames = function() {
      var n = [], i, c;
      if (this._eventsCount === 0) return n;
      for (c in i = this._events)
        t.call(i, c) && n.push(e ? c.slice(1) : c);
      return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(i)) : n;
    }, u.prototype.listeners = function(n) {
      var i = e ? e + n : n, c = this._events[i];
      if (!c) return [];
      if (c.fn) return [c.fn];
      for (var g = 0, d = c.length, l = new Array(d); g < d; g++)
        l[g] = c[g].fn;
      return l;
    }, u.prototype.listenerCount = function(n) {
      var i = e ? e + n : n, c = this._events[i];
      return c ? c.fn ? 1 : c.length : 0;
    }, u.prototype.emit = function(n, i, c, g, d, l) {
      var m = e ? e + n : n;
      if (!this._events[m]) return !1;
      var r = this._events[m], w = arguments.length, b, f;
      if (r.fn) {
        switch (r.once && this.removeListener(n, r.fn, void 0, !0), w) {
          case 1:
            return r.fn.call(r.context), !0;
          case 2:
            return r.fn.call(r.context, i), !0;
          case 3:
            return r.fn.call(r.context, i, c), !0;
          case 4:
            return r.fn.call(r.context, i, c, g), !0;
          case 5:
            return r.fn.call(r.context, i, c, g, d), !0;
          case 6:
            return r.fn.call(r.context, i, c, g, d, l), !0;
        }
        for (f = 1, b = new Array(w - 1); f < w; f++)
          b[f - 1] = arguments[f];
        r.fn.apply(r.context, b);
      } else {
        var L = r.length, E;
        for (f = 0; f < L; f++)
          switch (r[f].once && this.removeListener(n, r[f].fn, void 0, !0), w) {
            case 1:
              r[f].fn.call(r[f].context);
              break;
            case 2:
              r[f].fn.call(r[f].context, i);
              break;
            case 3:
              r[f].fn.call(r[f].context, i, c);
              break;
            case 4:
              r[f].fn.call(r[f].context, i, c, g);
              break;
            default:
              if (!b) for (E = 1, b = new Array(w - 1); E < w; E++)
                b[E - 1] = arguments[E];
              r[f].fn.apply(r[f].context, b);
          }
      }
      return !0;
    }, u.prototype.on = function(n, i, c) {
      return y(this, n, i, c, !1);
    }, u.prototype.once = function(n, i, c) {
      return y(this, n, i, c, !0);
    }, u.prototype.removeListener = function(n, i, c, g) {
      var d = e ? e + n : n;
      if (!this._events[d]) return this;
      if (!i)
        return p(this, d), this;
      var l = this._events[d];
      if (l.fn)
        l.fn === i && (!g || l.once) && (!c || l.context === c) && p(this, d);
      else {
        for (var m = 0, r = [], w = l.length; m < w; m++)
          (l[m].fn !== i || g && !l[m].once || c && l[m].context !== c) && r.push(l[m]);
        r.length ? this._events[d] = r.length === 1 ? r[0] : r : p(this, d);
      }
      return this;
    }, u.prototype.removeAllListeners = function(n) {
      var i;
      return n ? (i = e ? e + n : n, this._events[i] && p(this, i)) : (this._events = new s(), this._eventsCount = 0), this;
    }, u.prototype.off = u.prototype.removeListener, u.prototype.addListener = u.prototype.on, u.prefixed = e, u.EventEmitter = u, o.exports = u;
  })(C)), C.exports;
}
var $ = S();
const q = /* @__PURE__ */ z($);
class F extends q {
  #t;
  get value() {
    return this.#t;
  }
  constructor(t) {
    super(), this.#t = t;
  }
  change(t) {
    t(this.#t), this.emit("change", this.#t);
  }
  set(t) {
    this.#t = t, this.emit("change", t);
  }
}
export {
  v as $,
  B as C,
  j as I,
  A as P,
  I as R,
  _ as T,
  M as a,
  F as b,
  H as c,
  N as d,
  T as l
};
