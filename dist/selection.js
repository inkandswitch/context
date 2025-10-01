import { d as defineField, R as Reactive } from './assets/index-uxx6B13V.js';
import { C as CONTEXT } from './assets/index-CnahhtPs.js';

const IsSelectedSymbol = Symbol("IsSelected");
const IsSelected = defineField(
  "IsSelected",
  IsSelectedSymbol
);
const SelectionAPI = () => {
  const api = new Reactive({
    isSelected: () => false,
    setSelection: () => {
    },
    selectedRefs: []
  });
  const selectionContext = CONTEXT.subcontext();
  const onChangeContext = () => {
    const selectedRefs = selectionContext.refsWith(IsSelected);
    api.set({
      selectedRefs,
      isSelected(ref) {
        return selectedRefs.some((selectedRef) => selectedRef.doesOverlap(ref));
      },
      setSelection(refs) {
        selectionContext.replace(refs.map((ref) => ref.with(IsSelected(true))));
      }
    });
  };
  CONTEXT.subscribe(onChangeContext);
  api.on("destroy", () => {
    CONTEXT.remove(selectionContext);
  });
  return api;
};

export { SelectionAPI };
