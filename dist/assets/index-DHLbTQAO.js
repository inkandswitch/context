const j = (a, h) => Object.assign(
  (f) => ({ value: f, type: h, name: a }),
  { fieldName: a, type: h }
);
function O(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var m = { exports: {} }, w;
function L() {
  return w || (w = 1, (function(a) {
    var h = Object.prototype.hasOwnProperty, f = "~";
    function y() {
    }
    Object.create && (y.prototype = /* @__PURE__ */ Object.create(null), new y().__proto__ || (f = !1));
    function E(s, t, n) {
      this.fn = s, this.context = t, this.once = n || !1;
    }
    function x(s, t, n, r, l) {
      if (typeof n != "function")
        throw new TypeError("The listener must be a function");
      var c = new E(n, r || s, l), o = f ? f + t : t;
      return s._events[o] ? s._events[o].fn ? s._events[o] = [s._events[o], c] : s._events[o].push(c) : (s._events[o] = c, s._eventsCount++), s;
    }
    function g(s, t) {
      --s._eventsCount === 0 ? s._events = new y() : delete s._events[t];
    }
    function u() {
      this._events = new y(), this._eventsCount = 0;
    }
    u.prototype.eventNames = function() {
      var t = [], n, r;
      if (this._eventsCount === 0) return t;
      for (r in n = this._events)
        h.call(n, r) && t.push(f ? r.slice(1) : r);
      return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(n)) : t;
    }, u.prototype.listeners = function(t) {
      var n = f ? f + t : t, r = this._events[n];
      if (!r) return [];
      if (r.fn) return [r.fn];
      for (var l = 0, c = r.length, o = new Array(c); l < c; l++)
        o[l] = r[l].fn;
      return o;
    }, u.prototype.listenerCount = function(t) {
      var n = f ? f + t : t, r = this._events[n];
      return r ? r.fn ? 1 : r.length : 0;
    }, u.prototype.emit = function(t, n, r, l, c, o) {
      var v = f ? f + t : t;
      if (!this._events[v]) return !1;
      var e = this._events[v], p = arguments.length, _, i;
      if (e.fn) {
        switch (e.once && this.removeListener(t, e.fn, void 0, !0), p) {
          case 1:
            return e.fn.call(e.context), !0;
          case 2:
            return e.fn.call(e.context, n), !0;
          case 3:
            return e.fn.call(e.context, n, r), !0;
          case 4:
            return e.fn.call(e.context, n, r, l), !0;
          case 5:
            return e.fn.call(e.context, n, r, l, c), !0;
          case 6:
            return e.fn.call(e.context, n, r, l, c, o), !0;
        }
        for (i = 1, _ = new Array(p - 1); i < p; i++)
          _[i - 1] = arguments[i];
        e.fn.apply(e.context, _);
      } else {
        var b = e.length, d;
        for (i = 0; i < b; i++)
          switch (e[i].once && this.removeListener(t, e[i].fn, void 0, !0), p) {
            case 1:
              e[i].fn.call(e[i].context);
              break;
            case 2:
              e[i].fn.call(e[i].context, n);
              break;
            case 3:
              e[i].fn.call(e[i].context, n, r);
              break;
            case 4:
              e[i].fn.call(e[i].context, n, r, l);
              break;
            default:
              if (!_) for (d = 1, _ = new Array(p - 1); d < p; d++)
                _[d - 1] = arguments[d];
              e[i].fn.apply(e[i].context, _);
          }
      }
      return !0;
    }, u.prototype.on = function(t, n, r) {
      return x(this, t, n, r, !1);
    }, u.prototype.once = function(t, n, r) {
      return x(this, t, n, r, !0);
    }, u.prototype.removeListener = function(t, n, r, l) {
      var c = f ? f + t : t;
      if (!this._events[c]) return this;
      if (!n)
        return g(this, c), this;
      var o = this._events[c];
      if (o.fn)
        o.fn === n && (!l || o.once) && (!r || o.context === r) && g(this, c);
      else {
        for (var v = 0, e = [], p = o.length; v < p; v++)
          (o[v].fn !== n || l && !o[v].once || r && o[v].context !== r) && e.push(o[v]);
        e.length ? this._events[c] = e.length === 1 ? e[0] : e : g(this, c);
      }
      return this;
    }, u.prototype.removeAllListeners = function(t) {
      var n;
      return t ? (n = f ? f + t : t, this._events[n] && g(this, n)) : (this._events = new y(), this._eventsCount = 0), this;
    }, u.prototype.off = u.prototype.removeListener, u.prototype.addListener = u.prototype.on, u.prefixed = f, u.EventEmitter = u, a.exports = u;
  })(m)), m.exports;
}
var C = L();
const A = /* @__PURE__ */ O(C);
class k extends A {
  #e;
  get value() {
    return this.#e;
  }
  constructor(h) {
    super(), this.#e = h;
  }
  change(h) {
    h(this.#e), this.emit("change", this.#e);
  }
  set(h) {
    this.#e = h, this.emit("change", h);
  }
}
export {
  k as R,
  j as d
};
