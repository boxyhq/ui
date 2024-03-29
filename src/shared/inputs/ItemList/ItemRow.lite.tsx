import XMarkIcon from '../../icons/XMarkIcon.lite';
import styles from '../index.module.css';

export default function ItemRow({
  item,
  onItemChange,
  onItemDelete,
}: {
  item: string;
  onItemChange: (newItem: string) => void;
  onItemDelete: () => void;
}) {
  return (
    <div className='flex space-x-3 items-center'>
      <input
        type='text'
        className='input input-bordered input-sm w-full'
        name='item'
        value={item}
        onChange={(e) => {
          onItemChange(e.target.value);
        }}
        required
      />
      <button type='button' onClick={onItemDelete}>
        <XMarkIcon svgAttrs={{ class: styles['svg'] }} />
      </button>
    </div>
  );
}
