import { ToggleSwitchProps } from '../types';
import styles from './index.module.css';

export default function ToggleSwitch(props: ToggleSwitchProps) {
  return (
    <label class={styles.toggle}>
      {props.label}
      <input
        type='checkbox'
        class={`${styles.input} ${styles['sr-only']}`}
        onChange={(event) => props.onChange(event)}
        checked={props.checked}
        disabled={props.disabled}
      />
      <span class={styles.display}></span>
    </label>
  );
}
