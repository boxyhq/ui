import { useStore } from '@builder.io/mitosis';
import { ButtonProps } from '../types';
import styles from './index.module.css';

export default function Button(props: ButtonProps) {
  const state = useStore({
    variantCss: props.variant ? ' ' + styles[props.variant] : '',
  });
  return (
    <button
      type={props.type || 'button'}
      class={`${styles.btn}${state.variantCss}`}
      onClick={(event) => props.onClick?.(event)}>
      {props.name}
    </button>
  );
}
