import { C as CONTEXT, I as IdRef, l as loadRef } from './assets/index-CnahhtPs.js';
import { c as contextComputation } from './assets/computation-DhDdHiPJ.js';
import { m as memoize } from './assets/memoize-CsLHG05J.js';
import { d as defineField } from './assets/index-uxx6B13V.js';

const CommentsSymbol = Symbol("comments");
const Comments = defineField(
  "comments",
  CommentsSymbol
);
const getComments = memoize(
  (ref) => contextComputation(() => {
    const comments = CONTEXT.resolve(ref).get(Comments);
    return comments ? [comments] : [];
  }),
  (ref) => ref.toId()
);
const getCommentsOfDoc = (docHandle) => {
  const refsWithComments = [];
  const comments = docHandle.doc()["@comments"];
  if (!comments) {
    return [];
  }
  for (const comment of comments) {
    const commentRef = new IdRef(
      docHandle,
      ["@comments"],
      comment.id,
      "id"
    );
    for (const serializedRef of comment.refs) {
      const ref = loadRef(docHandle, serializedRef);
      refsWithComments.push(ref.with(Comments(commentRef)));
    }
  }
  return refsWithComments;
};
const createComment = ({
  refs,
  contactUrl
}) => {
  if (refs.length === 0) {
    throw new Error("A comments needs to be attached to at least one ref");
  }
  const docRef = refs[0].docRef;
  for (const ref of refs) {
    if (!ref.docRef.isEqual(docRef)) {
      throw new Error(
        "Creating comments across documents is currently not supported"
      );
    }
  }
  const commentId = crypto.randomUUID();
  docRef.change((doc) => {
    if (!doc["@comments"]) {
      doc["@comments"] = [];
    }
    doc["@comments"].push({
      refs: refs.map((ref) => ref.serialize()),
      isDraft: true,
      id: crypto.randomUUID(),
      contactUrl,
      timestamp: Date.now()
    });
  });
  return new IdRef(docRef.docHandle, ["@comments"], commentId, "id");
};
const allComments = contextComputation(() => CONTEXT.refsWith(Comments));

export { Comments, allComments, createComment, getComments, getCommentsOfDoc };
