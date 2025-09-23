import { Reactive } from '../reactive';
import { Ref } from '../core/refs';
type SelectionAPIProps = {
    isSelected: (ref: Ref) => boolean;
    setSelection: (refs: Ref[]) => void;
    selectedRefs: Ref[];
};
export declare const SelectionAPI: () => Reactive<SelectionAPIProps>;
export {};
