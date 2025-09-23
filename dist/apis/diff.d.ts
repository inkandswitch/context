import { DocHandle } from '@automerge/automerge-repo';
import { Ref, RefWith } from '../core/refs';
import * as Automerge from "@automerge/automerge";
type AddedDiff = {
    type: "added";
};
type ChangedDiff<T> = {
    type: "changed";
    before: T;
};
type DeletedDiff<T> = {
    type: "deleted";
    before: T;
};
export type DiffValue<T = unknown> = AddedDiff | ChangedDiff<T> | DeletedDiff<T>;
declare const DiffSymbol: unique symbol;
export type Diff = typeof DiffSymbol;
export declare const Diff: import('..').FieldType<typeof DiffSymbol, DiffValue<unknown>>;
export declare const getDiffOfDoc: (docHandle?: DocHandle<unknown>, headsBefore?: Automerge.Heads) => RefWith<Diff>[];
export declare const getDiff: (ref: Ref<unknown, unknown, never>) => import('..').Reactive<DiffValue<unknown> | undefined>;
export declare const getRefsWithDiffAt: (ref?: Ref<unknown, unknown, never> | undefined) => import('..').Reactive<RefWith<typeof DiffSymbol>[]>;
export {};
