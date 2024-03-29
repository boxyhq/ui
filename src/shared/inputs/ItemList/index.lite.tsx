import { For, useStore } from '@builder.io/mitosis';
import ItemRow from './ItemRow.lite';

type ItemListProps = {
  currentlist: string | string[];
  handleItemListUpdate: (newList: string[]) => void;
};

export default function ItemList(props: ItemListProps) {
  const state = useStore({
    get list() {
      return Array.isArray(props.currentlist) ? props.currentlist : [props.currentlist];
    },
    addAnother: () => {
      props.handleItemListUpdate([...state.list, '']);
    },
    handleItemUpdate: (newItem: string, index: number) => {
      const newList = [...state.list];
      newList[index] = newItem;
      props.handleItemListUpdate(newList);
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
                handleItemUpdate={(newItem) => state.handleItemUpdate(newItem, index)}
                handleItemDelete={() => props.handleItemListUpdate(state.list.filter((_, i) => i !== index))}
              />
            </div>
          )}
        </For>
        <div>
          <button className='btn btn-primary btn-sm btn-outline' type='button' onClick={state.addAnother}>
            bui-fs-add
          </button>
        </div>
      </div>
    </div>
  );
}
