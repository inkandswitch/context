import { Reactive } from '../reactive';
import { Context } from './context';
export declare const contextComputation: <T>(computation: (context: Context) => T) => Reactive<T>;
