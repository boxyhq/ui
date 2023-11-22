import { useStore } from '@builder.io/mitosis';
import styles from './index.module.css';
import { RadioGroupProps } from '../types';

export default function RadioGroup(props: RadioGroupProps) {
  const state = useStore({
    get id() {
      return props.label.replace(/ /g, '');
    },
    get orientationValue() {
      return props.orientation || 'horizontal';
    },
  });
  return (
    <div
      class={styles.container}
      role='radiogroup'
      aria-labelledby={state.id}
      aria-orientation={state.orientationValue}>
      <div class={styles.label} id={state.id}>
        {props.label}
      </div>
      <div class={styles.inputs}>{props.children}</div>
    </div>
  );
}
