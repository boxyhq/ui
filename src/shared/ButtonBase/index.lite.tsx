import { ButtonBaseProps } from '../types';
import { useStore } from '@builder.io/mitosis';
import commonStyles from '../common.module.css';
import styles from './index.module.css';

export default function ButtonBase(props: ButtonBaseProps) {
  const state = useStore({
    get classes() {
      return {
        iconClasses: styles.icon + (props.iconClasses ? ` ${props.iconClasses}` : ''),
      };
    },
  });

  return (
    <button
      type='button'
      color={props.color}
      class={commonStyles.btnReset}
      aria-label={props.label}
      onClick={(event) => props.onClick(event)}>
      {props.children}
    </button>
  );
}
