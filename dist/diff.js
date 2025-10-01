import * as Automerge from '@automerge/automerge';
import { P as PathRef, b as lookup, T as TextSpanRef, C as CONTEXT } from './assets/index-CnahhtPs.js';
import { m as memoize } from './assets/memoize-CsLHG05J.js';
import { c as contextComputation } from './assets/computation-DhDdHiPJ.js';
import { d as defineField } from './assets/index-uxx6B13V.js';

const last = (array) => {
  return array.length > 0 ? array[array.length - 1] : void 0;
};

const DiffSymbol = Symbol("diff");
const Diff = defineField("diff", DiffSymbol);
const getDiffOfDoc = (docHandle, headsBefore) => {
  const changedRefs = [];
  if (!headsBefore || !docHandle) {
    return [];
  }
  const docBefore = Automerge.view(docHandle.doc(), headsBefore);
  const docAfter = docHandle.doc();
  const patches = Automerge.diff(
    docAfter,
    headsBefore,
    Automerge.getHeads(docAfter)
  );
  const modifiedPaths = /* @__PURE__ */ new Set();
  for (const patch of patches) {
    const ancestorPath = typeof last(patch.path) === "number" ? patch.path.slice(0, -1) : patch.path;
    for (let i = ancestorPath.length; i > 0; i--) {
      const ancestorSubPath = ancestorPath.slice(0, i);
      const key = JSON.stringify(ancestorSubPath);
      if (modifiedPaths.has(key)) break;
      const ancestorRef = new PathRef(docHandle, ancestorSubPath);
      const before = lookup(docBefore, ancestorSubPath);
      if (before) {
        changedRefs.push(ancestorRef.with(Diff({ type: "changed", before })));
      } else {
        changedRefs.push(ancestorRef.with(Diff({ type: "added" })));
      }
      modifiedPaths.add(key);
    }
    const objRef = new PathRef(docHandle, patch.path);
    switch (patch.action) {
      case "put":
        changedRefs.push(objRef.with(Diff({ type: "added" })));
        break;
      case "del": {
        if (typeof last(patch.path) === "number") {
          const parentPath = patch.path.slice(0, -1);
          const parent = lookup(docBefore, parentPath);
          console.log("position", last(patch.path));
          if (typeof parent === "string") {
            const position = last(patch.path);
            const textSpan = new TextSpanRef(
              docHandle,
              parentPath,
              position,
              position
            );
            const before = "";
            changedRefs.push(textSpan.with(Diff({ type: "deleted", before })));
          } else if (Array.isArray(parent)) {
            throw new Error("not implemented");
          } else {
            throw new Error("Unexpected value, this should never happen");
          }
        } else {
          const before = lookup(docBefore, patch.path);
          changedRefs.push(objRef.with(Diff({ type: "deleted", before })));
        }
        break;
      }
      case "insert": {
        changedRefs.push(objRef.with(Diff({ type: "added" })));
        break;
      }
      case "splice":
        {
          const parentPath = patch.path.slice(0, -1);
          const from = last(patch.path);
          const to = from + patch.value.length;
          const textSpan = new TextSpanRef(docHandle, parentPath, from, to);
          changedRefs.push(textSpan.with(Diff({ type: "added" })));
        }
        break;
    }
  }
  return changedRefs;
};
const getDiff = memoize(
  (ref) => contextComputation(() => CONTEXT.resolve(ref).get(Diff)),
  (ref) => ref.toId()
);
const getRefsWithDiffAt = memoize(
  (ref) => contextComputation(() => {
    if (!ref) {
      return [];
    }
    return CONTEXT.refsWith(Diff).filter(
      (refWithDiff) => refWithDiff.isElementOf(ref)
    );
  }),
  (ref) => ref?.toId()
);

export { Diff, getDiff, getDiffOfDoc, getRefsWithDiffAt };
