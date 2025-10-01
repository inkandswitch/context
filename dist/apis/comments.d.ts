import { AutomergeUrl, DocHandle } from '@automerge/automerge-repo';
import { Ref, RefWith, SerializedRef } from '../core/refs';
export type DocWithComments = {
    "@comments"?: Comment[];
};
export type Comment = {
    refs: SerializedRef[];
    isDraft: boolean;
    id: string;
    content?: string;
    draftContent?: string;
    contactUrl: AutomergeUrl;
    timestamp: number;
};
declare const CommentsSymbol: unique symbol;
export type Comments = typeof CommentsSymbol;
export declare const Comments: import('..').FieldType<typeof CommentsSymbol, Ref<Comment, unknown, never>>;
export declare const getComments: (ref: Ref<unknown, unknown, never>) => import('..').Reactive<Ref<Comment, unknown, never>[]>;
export declare const getCommentsOfDoc: (docHandle: DocHandle<DocWithComments>) => RefWith<typeof CommentsSymbol>[];
export declare const createComment: ({ refs, contactUrl, }: {
    refs: Ref[];
    content: string;
    contactUrl: AutomergeUrl;
}) => RefWith<Comments>;
export declare const allComments: import('..').Reactive<RefWith<typeof CommentsSymbol>[]>;
export {};
