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
      ref={props.buttonRef}
      type={props.type || 'button'}
      class={`${styles.btn}${state.variantCss}${props.classNames ? ' ' + props.classNames : ''}`}
      disabled={props.isLoading}
      onClick={(event) => props.handleClick?.(event)}>
      {props.isLoading ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          className={`${styles.loading}`}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          class='lucide lucide-loader-2'>
          <path d='M21 12a9 9 0 1 1-6.219-8.56' />
        </svg>
      ) : null}
      {props.name}
    </button>
  );
}
