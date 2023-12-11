import { Show, useStore } from '@builder.io/mitosis';
import styles from './index.module.css';
import { RadioGroupProps } from '../types';
import Spacer from '../Spacer/index.lite';

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
      <Show when={state.orientationValue === 'horizontal'}>
        <Spacer x={1} />
      </Show>
      <Show when={state.orientationValue === 'horizontal'}>
        <Spacer y={1} />
      </Show>
      <div class={styles.inputs}>{props.children}</div>
    </div>
  );
}
