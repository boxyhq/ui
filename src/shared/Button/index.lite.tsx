import { useStore } from '@builder.io/mitosis';
import { ButtonProps } from '../types';
import styles from './index.module.css';

export default function Button(props: ButtonProps) {
  const state = useStore({
    get variantCss() {
      return props.variant ? ' ' + styles[props.variant] : '';
    },
  });
  return (
    <button
      type={props.type || 'button'}
      class={`${styles.btn}${state.variantCss}${props.classNames ? ' ' + props.classNames : ''}`}
      onClick={(event) => props.handleClick?.(event)}>
      {props.name}
    </button>
  );
}
