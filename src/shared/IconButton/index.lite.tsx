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
    <div class='tooltip' data-tip={props.tooltip}>
      <button
        type='button'
        onClick={(event) => props.onClick(event)}
        class={commonStyles.btnReset}
        aria-label={props.label}>
        <props.Icon svgElmtProps={{ class: state.classes.iconClasses, 'aria-hidden': true }} />
      </button>
    </div>
  );
}
