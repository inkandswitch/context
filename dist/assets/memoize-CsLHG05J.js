const memoize = (fn, resolver) => {
  const cache = /* @__PURE__ */ new Map();
  const registry = new FinalizationRegistry((key) => {
    cache.delete(key);
  });
  return function memoized(...args) {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    const weakRef = cache.get(key);
    if (weakRef) {
      const cachedValue = weakRef.deref();
      if (cachedValue !== void 0) {
        return cachedValue;
      }
      cache.delete(key);
    }
    const result = fn(...args);
    cache.set(key, new WeakRef(result));
    registry.register(result, key);
    return result;
  };
};

export { memoize as m };
