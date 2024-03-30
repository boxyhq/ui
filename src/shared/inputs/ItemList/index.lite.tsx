import { For, useStore } from '@builder.io/mitosis';
import ItemRow from './ItemRow.lite';

type ItemListProps = {
  currentlist: string | string[];
  fieldName: string;
  handleItemListUpdate: (fieldName: string, newList: string[]) => void;
};

export default function ItemList(props: ItemListProps) {
  const state = useStore({
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
    handleItemDelete: (index: number) => {
      props.handleItemListUpdate(
        props.fieldName,
        state.list.filter((_, i) => i !== index)
      );
    },
  });

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <For each={state.list}>
          {(item, index) => (
            <div>
              <ItemRow
                item={item}
                index={index}
                handleItemUpdate={state.handleItemUpdate}
                handleItemDelete={state.handleItemDelete}
              />
            </div>
          )}
        </For>
        <div>
          <button
            className='btn btn-primary btn-sm btn-outline'
            type='button'
            onClick={(event) => state.addAnother()}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
