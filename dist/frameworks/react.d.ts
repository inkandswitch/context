import { Reactive } from '../reactive';
import { Context } from '../core/context';
export declare const useReactive: <T>(reactiveOrFn: Reactive<T> | (() => Reactive<T>)) => T;
export declare const useSubcontext: () => Context;
