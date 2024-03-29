import { For, useStore } from '@builder.io/mitosis';
import ItemRow from './ItemRow.lite';

type ItemListProps = {
  currentlist: string | string[];
  handleItemListChange: (list: string[]) => void;
};

export default function ItemList(props: ItemListProps) {
  const state = useStore({
    get list() {
      return Array.isArray(props.currentlist) ? props.currentlist : [props.currentlist];
    },
    addAnother: () => {
      props.handleItemListChange([...state.list, '']);
    },
  });

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <For each={state.list}>
          {(item, index) => (
            <div key={index}>
              <ItemRow
                item={item}
                handleItemChange={(newItem) => {
                  const newList = [...state.list];
                  newList[index] = newItem;
                  props.handleItemListChange(newList);
                }}
                handleItemDelete={() => {
                  props.handleItemListChange(state.list.filter((_, i) => i !== index));
                }}
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
