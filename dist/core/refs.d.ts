import { AutomergeUrl, DocHandle } from '@automerge/automerge-repo';
import { FieldType, FieldValue } from './fields';
import * as Automerge from "@automerge/automerge";
export declare const $fields: unique symbol;
export type RefWith<Fields extends symbol> = Ref<unknown, unknown, Fields>;
type SerializedPathRef = {
    type: "path";
    path: Automerge.Prop[];
};
type SerializedIdRef = {
    type: "id";
    path: Automerge.Prop[];
    key: Automerge.Prop;
    id: string;
};
type SerializedTextSpanRef = {
    type: "text-span";
    path: Automerge.Prop[];
    from: Automerge.Cursor;
    to: Automerge.Cursor;
};
type SerializedRef = SerializedPathRef | SerializedIdRef | SerializedTextSpanRef;
export declare abstract class Ref<Value = unknown, Doc = unknown, Fields extends symbol = never> {
    [$fields]: Map<symbol, any>;
    protected readonly docHandle: DocHandle<Doc>;
    readonly path: Automerge.Prop[];
    constructor(docHandle: DocHandle<Doc>, path: Automerge.Prop[]);
    abstract toId(): string;
    protected abstract resolve(doc: Doc): Value;
    abstract clone(): Ref<Value, Doc, Fields>;
    abstract serialize(): SerializedRef;
    get value(): Value;
    valueAt(heads: Automerge.Heads): Value;
    slice(from: number, to: number): TextSpanRef<string, Doc, never>;
    get docRef(): Ref<Doc, Doc, Fields>;
    get docUrl(): AutomergeUrl;
    change(fn: (obj: Value) => void): void;
    isEqual(other: Ref): boolean;
    doesOverlap(other: Ref): boolean;
    isChildOf(other: Ref): boolean;
    with<Type extends symbol, Value>(field: FieldValue<Type, Value>): Ref<Value, Doc, Fields | Type>;
    get<Type extends symbol, Value>(field: FieldType<Type, Value>): Type extends Fields ? Value : Value | undefined;
    has<Type extends symbol, Value>(field: FieldType<Type, Value>): Type extends Fields ? true : boolean;
    get fields(): [symbol, any][];
}
export declare class PathRef<Value = unknown, Doc = unknown, Fields extends symbol = never> extends Ref<Value, Doc, Fields> {
    constructor(docHandle: DocHandle<Doc>, path: Automerge.Prop[]);
    protected resolve(doc: Automerge.Doc<Doc>): Value;
    toId(): string;
    clone(): Ref<Value, Doc, Fields>;
    serialize(): SerializedRef;
}
export declare class IdRef<Value, Doc, Fields extends symbol = never> extends Ref<Value, Doc, Fields> {
    #private;
    constructor(docHandle: DocHandle<Doc>, path: Automerge.Prop[], id: any, key: Automerge.Prop);
    protected resolve(doc: Automerge.Doc<Doc>): Value;
    toId(): string;
    clone(): Ref<Value, Doc, Fields>;
    serialize(): SerializedRef;
}
export declare class TextSpanRef<Value = string, Doc = unknown, Fields extends symbol = never> extends Ref<Value, Doc, Fields> {
    #private;
    constructor(docHandle: DocHandle<Doc>, path: Automerge.Prop[], from: number | Automerge.Cursor, to: number | Automerge.Cursor);
    get from(): number;
    get to(): number;
    protected resolve(doc: Automerge.Doc<Doc>): Value;
    toId(): string;
    isChildOf(other: Ref): boolean;
    doesOverlap(other: Ref): boolean;
    slice(from: number, to: number): TextSpanRef<string, Doc, never>;
    change(fn: (obj: Value) => void): void;
    clone(): Ref<Value, Doc, Fields>;
    serialize(): SerializedRef;
}
export type TextSpanRefWith<Fields extends symbol> = TextSpanRef<unknown, unknown, Fields>;
export declare const loadRef: (docHandle: DocHandle<unknown>, ref: SerializedRef) => Ref;
export {};
