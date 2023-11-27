import { useStore } from '@builder.io/mitosis';
import { RadioProps } from '../types';
import styles from './index.module.css';
import Spacer from '../Spacer/index.lite';

export default function Radio(props: RadioProps) {
  const state = useStore({
    get id() {
      return props.value.replace(/ /g, '');
    },
  });
  return (
    <div class={styles.radioDiv}>
      <input
        type='radio'
        value={props.value}
        checked={props.checked}
        name={props.name}
        id={state.id}
        class={styles.radio}
        onChange={(event) => props.handleInputChange(event)}
      />
      <Spacer x={1} />
      <label for={state.id}>{props.children}</label>
    </div>
  );
}
