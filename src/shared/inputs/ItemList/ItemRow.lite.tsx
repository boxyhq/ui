import XMarkIcon from '../../icons/XMarkIcon.lite';
import styles from '../index.module.css';

type ItemRowProps = {
  item: string;
  handleItemChange: (newItem: string) => void;
  handleItemDelete: () => void;
};

export default function ItemRow({ item, handleItemChange, handleItemDelete }: ItemRowProps) {
  return (
    <div className='flex space-x-3 items-center'>
      <input
        type='text'
        className='input input-bordered input-sm w-full'
        name='item'
        value={item}
        onChange={(e) => {
          handleItemChange(e.target.value);
        }}
        required
      />
      <button type='button' onClick={handleItemDelete}>
        <XMarkIcon svgAttrs={{ class: styles['svg'] }} />
      </button>
    </div>
  );
}
