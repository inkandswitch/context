type MemoizeResolver<TArgs extends readonly unknown[], TKey> = (...args: TArgs) => TKey;
export declare const memoize: <TArgs extends readonly unknown[], TReturn extends WeakKey, TKey = string>(fn: (...args: TArgs) => TReturn, resolver?: MemoizeResolver<TArgs, TKey>) => ((...args: TArgs) => TReturn);
export {};
