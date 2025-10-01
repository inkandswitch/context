import { Reactive } from '../reactive';
export declare const createReactive: <T>(reactiveOrFn: Reactive<T> | (() => Reactive<T>)) => any;
export declare const createSubcontext: () => import('..').Context;
