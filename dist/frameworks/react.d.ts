import { Reactive } from '../reactive';
export declare const useReactive: <T>(reactiveOrFn: Reactive<T> | (() => Reactive<T>)) => T;
