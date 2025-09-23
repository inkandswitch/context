const d = (a, c) => {
  const e = /* @__PURE__ */ new Map(), f = new FinalizationRegistry((o) => {
    e.delete(o);
  });
  return function(...n) {
    const t = c ? c(...n) : JSON.stringify(n), r = e.get(t);
    if (r) {
      const s = r.deref();
      if (s !== void 0)
        return s;
      e.delete(t);
    }
    const i = a(...n);
    return e.set(t, new WeakRef(i)), f.register(i, t), i;
  };
};
export {
  d as m
};
