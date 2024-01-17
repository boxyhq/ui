import { Show, useStore } from '@builder.io/mitosis';
import { ButtonProps } from '../types';
import styles from './index.module.css';
import Spinner from '../Spinner/index.lite';

export default function Button(props: ButtonProps) {
  const state = useStore({
    get buttonHTMLAttributes() {
      const { buttonRef, name, handleClick, type, variant, classNames, isLoading, ...rest } = props;
      return rest;
    },
    get variantCss() {
      return props.variant ? ' ' + styles[props.variant] : '';
    },
  });

  return (
    <button
      ref={props.buttonRef}
      type={props.type || 'button'}
      class={`${styles.btn}${state.variantCss}${props.classNames ? ' ' + props.classNames : ''}`}
      disabled={props.isLoading}
      onClick={(event) => props.handleClick?.(event)}
      {...state.buttonHTMLAttributes}>
      <Show when={props.isLoading}>
        <Spinner variant='small' color='currentColor' />
      </Show>
      {props.name}
    </button>
  );
}
