import XMarkIcon from '../../icons/XMarkIcon.lite';
import styles from '../index.module.css';

type ItemRowProps = {
  item: string;
  handleItemUpdate: (newItem: string) => void;
  handleItemDelete: () => void;
};

export default function ItemRow({ item, handleItemUpdate, handleItemDelete }: ItemRowProps) {
  return (
    <div className='flex space-x-3 items-center'>
      <input
        type='text'
        className='input input-bordered input-sm w-full'
        name='item'
        value={item}
        onChange={(e) => {
          handleItemUpdate(e.target.value);
        }}
        required
      />
      <button type='button' onClick={handleItemDelete}>
        <XMarkIcon svgAttrs={{ class: styles['svg'] }} />
      </button>
    </div>
  );
}
