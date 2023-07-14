import { ButtonProps } from '../types';
import commonStyles from '../common.module.css';

export default function ButtonOutline(props: ButtonProps) {
  return (
    <button
      aria-label={props.label}
      type='button'
      class={commonStyles.button}
      onClick={() => props.onClick()}>
      {props.children}
    </button>
  );
}
