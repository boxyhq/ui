import { For, Show, useStore } from '@builder.io/mitosis';
import ItemRow from './ItemRow.lite';
import styles from '../index.module.css';
import listStyles from './index.module.css';
import cssClassAssembler from '../../../sso/utils/cssClassAssembler';

type ItemListProps = {
  label: string;
  inputType: 'text' | 'url' | 'number' | 'password';
  classNames?: { label?: string };
  currentlist: string | string[];
  fieldName: string;
  handleItemListUpdate: (fieldName: string, newList: string[]) => void;
};

export default function ItemList(props: ItemListProps) {
  const state = useStore({
    duplicateEntryIndex: undefined as undefined | number,
    get list() {
      return Array.isArray(props.currentlist) ? props.currentlist : [props.currentlist];
    },
    addAnother: () => {
      props.handleItemListUpdate(props.fieldName, [...state.list, '']);
    },
    handleItemUpdate: (newItem: string, index: number) => {
      const newList = [...state.list];
      newList[index] = newItem;
      props.handleItemListUpdate(props.fieldName, newList);
    },
    checkDuplicates(index: number) {
      const _item = state.list[index];
      // search backwards
      const _firstIndex = state.list.indexOf(_item);
      if (_firstIndex !== index) {
        state.duplicateEntryIndex = index;
        return;
      } else if (state.duplicateEntryIndex === index) {
        state.duplicateEntryIndex = undefined;
      }
      // search forwards
      const _nextIndex = state.list.slice(index + 1).indexOf(_item);
      if (_nextIndex !== -1) {
        state.duplicateEntryIndex = index;
      } else if (state.duplicateEntryIndex === index) {
        state.duplicateEntryIndex = undefined;
      }
    },
    handleItemDelete: (index: number) => {
      const _itemToDelete = state.list[index];
      if (
        state.duplicateEntryIndex !== undefined &&
        (state.duplicateEntryIndex === index || _itemToDelete === state.list[state.duplicateEntryIndex])
      ) {
        state.duplicateEntryIndex = undefined;
      }
      props.handleItemListUpdate(
        props.fieldName,
        state.list.filter((_, i) => i !== index)
      );
    },
    get cssClass() {
      return {
        label: cssClassAssembler(props.classNames?.label, styles.label),
      };
    },
  });

  return (
    <fieldset class={styles.fieldset}>
      <legend class={state.cssClass.label}>{props.label}</legend>
      <div class={listStyles.rowContainer}>
        <For each={state.list}>
          {(item, index) => (
            <div>
              <ItemRow
                inputType={props.inputType}
                item={item}
                index={index}
                isDuplicateItem={state.duplicateEntryIndex === index}
                handleItemUpdate={state.handleItemUpdate}
                handleItemDelete={state.handleItemDelete}
                disableDelete={index === 0 && state.list.length === 1}
                handleBlur={state.checkDuplicates}
                readOnly={state.duplicateEntryIndex !== undefined && state.duplicateEntryIndex !== index}
              />
              <Show when={state.duplicateEntryIndex === index}>
                <span>Duplicate entries not allowed</span>
              </Show>
            </div>
          )}
        </For>
        <div>
          <button
            className='btn btn-primary btn-sm btn-outline'
            type='button'
            disabled={state.duplicateEntryIndex !== undefined}
            onClick={(event) => state.addAnother()}>
            Add URL
          </button>
        </div>
      </div>
    </fieldset>
  );
}
