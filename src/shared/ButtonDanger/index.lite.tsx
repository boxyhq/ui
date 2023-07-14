import { ButtonProps } from '../types';
import commonStyles from '../common.module.css';

export default function ButtonDanger(props: ButtonProps) {
  return (
    <button type='button' class={commonStyles.button} onClick={() => props.onClick()}>
      {props.children}
    </button>
  );
}
