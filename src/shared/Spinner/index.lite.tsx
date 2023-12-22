import { useStore } from '@builder.io/mitosis';
import styles from './index.module.css';

interface SpinnerProps {
  variant?: 'small';
  /** default var(--primary-color) */
  color?: 'currentColor';
}
export default function Spinner(props: SpinnerProps) {
  const state = useStore({
    get css() {
      return (
        (props.variant ? ' ' + styles[props.variant] : '') +
        (props.color === 'currentColor' ? ' ' + styles[props.color] : '')
      );
    },
  });
  return <span class={`${styles.spinner}${state.css}`} aria-hidden={true} aria-label='Loading'></span>;
}
