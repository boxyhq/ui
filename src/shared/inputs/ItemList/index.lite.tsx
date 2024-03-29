import ItemRow from './ItemRow.lite';

export default function ItemList({
  currentlist,
  onItemListChange,
}: {
  currentlist: string | string[];
  onItemListChange: (list: string[]) => void;
}) {
  const list = Array.isArray(currentlist) ? currentlist : [currentlist];

  const addAnother = () => {
    onItemListChange([...list, '']);
  };

  return (
    <div>
      <div className='flex flex-col gap-4'>
        {list.map((item, index) => (
          <div key={index}>
            <ItemRow
              item={item}
              onItemChange={(newItem) => {
                const newList = [...list];
                newList[index] = newItem;
                onItemListChange(newList);
              }}
              onItemDelete={() => {
                onItemListChange(list.filter((_, i) => i !== index));
              }}
            />
          </div>
        ))}
        <div>
          <button className='btn btn-primary btn-sm btn-outline' type='button' onClick={addAnother}>
            {'bui-fs-add'}
          </button>
        </div>
      </div>
    </div>
  );
}
