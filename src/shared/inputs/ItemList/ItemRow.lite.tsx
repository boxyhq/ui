import XMarkIcon from '../../icons/XMarkIcon.lite';
import styles from '../index.module.css';

type ItemRowProps = {
  item: string;
  index: number;
  handleItemUpdate: (newItem: string, index: number) => void;
  handleItemDelete: (index: number) => void;
};

export default function ItemRow(props: ItemRowProps) {
  return (
    <div className='flex space-x-3 items-center'>
      <input
        type='text'
        className='input input-bordered input-sm w-full'
        name='item'
        value={props.item}
        onChange={(event) => props.handleItemUpdate(event.target.value, props.index)}
        required
      />
      <button
        type='button'
        onClick={(event) => props.handleItemDelete(props.index)}
        disabled={props.index === 0}>
        <XMarkIcon svgAttrs={{ class: styles['svg'] }} />
      </button>
    </div>
  );
}
