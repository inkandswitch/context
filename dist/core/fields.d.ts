export type FieldValue<Type extends symbol, Value> = {
    type: Type;
    name: string;
    value: Value;
};
export type FieldType<Type extends symbol, Value> = {
    (value: Value): FieldValue<Type, Value>;
    fieldName: string;
    type: Type;
};
export declare const defineField: <Type extends symbol, Value>(fieldName: string, type: Type) => FieldType<Type, Value>;
