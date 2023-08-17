import type { IconButtonProps } from '../types';
import styles from './index.module.css';
import { useStore } from '@builder.io/mitosis';

export default function IconButton(props: IconButtonProps) {
  const state = useStore({
    get classes() {
      return {
        iconClasses: styles.icon + (props.iconClasses ? ` ${props.iconClasses}` : ''),
      };
    },
  });
  // TODO: bring tooltip
  return (
    <button
      type='button'
      onClick={(event) => props.onClick(event)}
      class={styles.btn}
      aria-label={props.label}>
      <props.Icon svgElmtProps={{ 'aria-hidden': true }} classNames={state.classes.iconClasses} />
    </button>
  );
}
