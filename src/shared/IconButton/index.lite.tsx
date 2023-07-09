import type { IconButtonProps } from '../types';
import commonStyles from '../common.module.css';
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
  return (
    <button type='button' onClick={props.onClick} class={commonStyles.btnReset} aria-label={props.label}>
      <props.Icon aria-hidden class={state.classes.iconClasses} />
    </button>
  );
}
