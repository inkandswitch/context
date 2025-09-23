import { default as EventEmitter } from 'eventemitter3';
export declare class Reactive<Value> extends EventEmitter<{
    change: (value: Value) => void;
    destroy: () => void;
}> {
    #private;
    get value(): Value;
    constructor(props: Value);
    change(mutate: (props: Value) => void): void;
    set(props: Value): void;
}
