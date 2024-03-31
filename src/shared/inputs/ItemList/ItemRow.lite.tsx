import XMarkIcon from '../../icons/XMarkIcon.lite';
import styles from '../index.module.css';

type ItemRowProps = {
  inputType: 'text' | 'url' | 'number' | 'password';
  item: string;
  index: number;
  handleItemUpdate: (newItem: string, index: number) => void;
  handleItemDelete: (index: number) => void;
  handleBlur: (index: number) => void;
  isDuplicateItem?: boolean;
  disableDelete?: boolean;
  readOnly?: boolean;
};

export default function ItemRow(props: ItemRowProps) {
  return (
    <div className='flex space-x-3 items-center'>
      <input
        type={props.inputType || 'text'}
        className='input input-bordered input-sm w-full'
        name='item'
        value={props.item}
        onChange={(event) => props.handleItemUpdate(event.target.value, props.index)}
        onBlur={(event) => props.handleBlur(props.index)}
        required
        disabled={props.readOnly}
      />
      <button
        type='button'
        onClick={(event) => props.handleItemDelete(props.index)}
        disabled={props.disableDelete}>
        <XMarkIcon svgAttrs={{ class: styles['svg'] }} />
      </button>
    </div>
  );
}
