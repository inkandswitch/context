import * as Automerge from '@automerge/automerge';

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  const ta = typeof a;
  const tb = typeof b;
  if (ta !== tb) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (ta === "object" && tb === "object") {
    const ao = a;
    const bo = b;
    const ak = Object.keys(ao);
    const bk = Object.keys(bo);
    if (ak.length !== bk.length) return false;
    ak.sort();
    bk.sort();
    for (let i = 0; i < ak.length; i++) {
      if (ak[i] !== bk[i]) return false;
      const key = ak[i];
      if (!deepEqual(ao[key], bo[key])) return false;
    }
    return true;
  }
  return false;
}

const lookup = (doc, path) => {
  let current = doc;
  for (const key of path) {
    current = current[key];
    if (current === void 0) {
      return void 0;
    }
  }
  return current;
};

const $fields = Symbol("fields");
class Ref {
  [$fields] = /* @__PURE__ */ new Map();
  docHandle;
  path;
  constructor(docHandle, path) {
    this.docHandle = docHandle;
    this.path = path;
  }
  // ==== value methods ====
  get value() {
    return this.resolve(this.docHandle.doc());
  }
  valueAt(heads) {
    return this.resolve(Automerge.view(this.docHandle.doc(), heads));
  }
  // todo: this is not right
  // the method should only be available if the value is a string
  slice(from, to) {
    return new TextSpanRef(this.docHandle, this.path, from, to);
  }
  get docRef() {
    return new PathRef(this.docHandle, []);
  }
  get docUrl() {
    return this.docHandle.url;
  }
  // ==== mutation methods ====
  change(fn) {
    this.docHandle.change((doc) => {
      const obj = this.resolve(doc);
      if (obj) {
        fn(obj);
      }
    });
  }
  // ==== ref arithmetic methods ====
  isEqual(other) {
    return this.toId() === other.toId();
  }
  doesOverlap(other) {
    return this.toId() === other.toId();
  }
  isChildOf(other) {
    if (other.docHandle !== this.docHandle || other.path.length + 1 !== this.path.length) {
      return false;
    }
    for (let i = 0; i < other.path.length; i++) {
      if (this.path[i] !== other.path[i]) {
        return false;
      }
    }
    return true;
  }
  // ==== field methods ====
  with(field) {
    const clone = this.clone();
    clone[$fields] = new Map(this[$fields]);
    clone[$fields].set(field.type, field.value);
    return clone;
  }
  get(field) {
    return this[$fields].get(field.type);
  }
  has(field) {
    return this[$fields].has(field.type);
  }
  get fields() {
    return Array.from(this[$fields].entries());
  }
}
class PathRef extends Ref {
  constructor(docHandle, path) {
    super(docHandle, path);
  }
  resolve(doc) {
    return lookup(doc, this.path);
  }
  toId() {
    const url = this.docHandle.url;
    const path = JSON.stringify(this.path);
    return `${url}:${path}`;
  }
  clone() {
    return new PathRef(this.docHandle, this.path);
  }
  serialize() {
    return { type: "path", path: this.path };
  }
}
class IdRef extends Ref {
  #id;
  #key;
  constructor(docHandle, path, id, key) {
    super(docHandle, path);
    this.#id = id;
    this.#key = key;
  }
  resolve(doc) {
    const objects = lookup(doc, this.path);
    return objects.find((obj) => obj[this.#key] === this.#id);
  }
  toId() {
    return this.#id;
  }
  clone() {
    return new IdRef(this.docHandle, this.path, this.#id, this.#key);
  }
  serialize() {
    return {
      type: "id",
      path: this.path,
      id: this.#id,
      key: this.#key
    };
  }
}
class TextSpanRef extends Ref {
  #fromCursor;
  #toCursor;
  constructor(docHandle, path, from, to) {
    super(docHandle, path);
    const doc = docHandle.doc();
    this.#fromCursor = typeof from === "number" ? Automerge.getCursor(doc, path, from) : from;
    this.#toCursor = typeof to === "number" ? Automerge.getCursor(doc, path, to) : to;
  }
  get from() {
    return Automerge.getCursorPosition(
      this.docHandle.doc(),
      this.path,
      this.#fromCursor
    );
  }
  get to() {
    return Automerge.getCursorPosition(
      this.docHandle.doc(),
      this.path,
      this.#toCursor
    );
  }
  resolve(doc) {
    const from = Automerge.getCursorPosition(doc, this.path, this.#fromCursor);
    const to = Automerge.getCursorPosition(doc, this.path, this.#toCursor);
    return lookup(doc, this.path).slice(from, to);
  }
  toId() {
    return `${this.#fromCursor}:${this.#toCursor}`;
  }
  isChildOf(other) {
    return this.doesOverlap(other);
  }
  doesOverlap(other) {
    if (!(other instanceof TextSpanRef) || this.docHandle !== other.docHandle || this.path.length !== other.path.length) {
      return false;
    }
    for (let i = 0; i < this.path.length; i++) {
      if (this.path[i] !== other.path[i]) return false;
    }
    const aStart = Math.min(this.from, this.to);
    const aEnd = Math.max(this.from, this.to);
    const bStart = Math.min(other.from, other.to);
    const bEnd = Math.max(other.from, other.to);
    return aEnd > bStart && bEnd > aStart;
  }
  slice(from, to) {
    return new TextSpanRef(
      this.docHandle,
      this.path,
      this.from + from,
      this.from + to
    );
  }
  // todo: figure out what to do here
  // we could implement a mutable string here but that feels bad
  change(fn) {
    throw new Error("not implemented");
  }
  clone() {
    return new TextSpanRef(this.docHandle, this.path, this.from, this.to);
  }
  serialize() {
    return {
      type: "text-span",
      path: this.path,
      from: this.#fromCursor,
      to: this.#toCursor
    };
  }
}
const loadRef = (docHandle, ref) => {
  switch (ref.type) {
    case "path":
      return new PathRef(docHandle, ref.path);
    case "id":
      return new IdRef(docHandle, ref.path, ref.id, ref.key);
    case "text-span":
      return new TextSpanRef(docHandle, ref.path, ref.from, ref.to);
  }
};

class Context {
  #subscribers = /* @__PURE__ */ new Set();
  #refsById = /* @__PURE__ */ new Map();
  #subcontexts = /* @__PURE__ */ new Set();
  constructor() {
  }
  // ==== mutation methods ====
  add(ref) {
    addTo(this.#refsById, ref);
    this.#notify();
  }
  replace(ref) {
    const newRefsById = /* @__PURE__ */ new Map();
    addTo(newRefsById, ref);
    if (isEqual(this.#refsById, newRefsById)) {
      return;
    }
    this.#refsById = newRefsById;
    this.#notify();
  }
  // ==== query methods ====
  resolve(ref) {
    const clone = ref.clone();
    const fields = /* @__PURE__ */ new Map();
    clone[$fields] = fields;
    this.#resolveRef(clone);
    return clone;
  }
  #resolveRef(ref) {
    const storedRef = this.#refsById.get(ref.toId());
    if (storedRef) {
      for (const [key, value] of storedRef[$fields].entries()) {
        ref[$fields].set(key, value);
      }
    }
    for (const context of this.#subcontexts) {
      context.#resolveRef(ref);
    }
  }
  get refs() {
    const refsById = /* @__PURE__ */ new Map();
    this.#resolveAll(refsById);
    return Array.from(refsById.values());
  }
  #resolveAll(refsById) {
    for (const ref of this.#refsById.values()) {
      const id = ref.toId();
      let resolvedRef = refsById.get(id);
      if (!resolvedRef) {
        resolvedRef = ref.clone();
        refsById.set(id, resolvedRef);
      }
      for (const [key, value] of ref[$fields].entries()) {
        resolvedRef[$fields].set(key, value);
      }
    }
    for (const context of this.#subcontexts) {
      context.#resolveAll(refsById);
    }
  }
  refsWith(field) {
    return this.refs.filter(
      (ref) => ref.has(field)
    );
  }
  // ==== subscription methods ====
  #notify = () => {
    this.#subscribers.forEach((subscriber) => subscriber());
  };
  subscribe(fn) {
    this.#subscribers.add(fn);
  }
  unsubscribe(fn) {
    this.#subscribers.delete(fn);
  }
  // ==== subcontext methods ====
  subcontext() {
    const subcontext = new Context();
    subcontext.subscribe(this.#notify);
    this.#subcontexts.add(subcontext);
    return subcontext;
  }
  remove(context) {
    context.unsubscribe(this.#notify);
    this.#subcontexts.delete(context);
  }
}
const addTo = (refsById, ref) => {
  if (Array.isArray(ref)) {
    for (const item of ref) {
      addTo(refsById, item);
    }
    return;
  }
  let storedRef = refsById.get(ref.toId());
  if (!storedRef) {
    storedRef = ref.clone();
    refsById.set(ref.toId(), storedRef);
  }
  for (const [key, value] of ref[$fields].entries()) {
    storedRef[$fields].set(key, value);
  }
};
const isEqual = (a, b) => {
  if (a.size !== b.size) {
    return false;
  }
  for (const refA of a.values()) {
    const refB = b.get(refA.toId());
    if (!refB) {
      return false;
    }
    const fieldsA = refA[$fields];
    const fieldsB = refB[$fields];
    if (fieldsA.size !== fieldsB.size) {
      return false;
    }
    for (const [fieldTypeA, fieldValueA] of fieldsA.entries()) {
      const fieldValueB = fieldsB.get(fieldTypeA);
      if (!fieldValueB) {
        return false;
      }
      if (!deepEqual(fieldValueA, fieldValueB)) {
        return false;
      }
    }
  }
  return true;
};

const CONTEXT = new Context();

export { $fields as $, CONTEXT as C, IdRef as I, PathRef as P, Ref as R, TextSpanRef as T, Context as a, lookup as b, loadRef as l };
