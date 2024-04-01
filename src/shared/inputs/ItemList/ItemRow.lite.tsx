import XMarkIcon from '../../icons/XMarkIcon.lite';
import styles from '../index.module.css';
import itemStyles from './index.module.css';

type ItemRowProps = {
  inputType: 'text' | 'url' | 'number' | 'password';
  item: string;
  index: number;
  handleItemUpdate: (newItem: string, index: number) => void;
  handleItemDelete: (index: number) => void;
  handleBlur: (index: number) => void;
  isDuplicateItem?: boolean;
  disableDelete?: boolean;
  disabled?: boolean;
  classNames: { input: string };
};

export default function ItemRow(props: ItemRowProps) {
  return (
    <div class={itemStyles.row}>
      <input
        type={props.inputType || 'text'}
        class={`${props.classNames.input} ${styles['input-sm']} ${itemStyles['input']}`}
        name='item'
        value={props.item}
        onChange={(event) => props.handleItemUpdate(event.target.value, props.index)}
        onBlur={(event) => props.handleBlur(props.index)}
        required
        disabled={props.disabled}
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
