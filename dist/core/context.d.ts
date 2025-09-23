import { FieldType } from './fields';
import { Ref, RefWith } from './refs';
export declare class Context {
    #private;
    constructor();
    add(ref: Ref | Ref[]): void;
    replace(ref: Ref | Ref[]): void;
    resolve(ref: Ref): Ref;
    get refs(): Ref[];
    refsWith<Type extends symbol>(field: FieldType<Type, any>): RefWith<Type>[];
    subscribe(fn: () => void): void;
    unsubscribe(fn: () => void): void;
    subcontext(): Context;
    remove(context: Context): void;
}
