import { ToggleSwitchProps } from '../types';
import defaultStyles from './index.module.css';
import commonStyles from '../common.module.css';

export default function ToggleSwitch(props: ToggleSwitchProps) {
  return (
    <label class={defaultStyles.toggle}>
      {props.label}
      <input
        type='checkbox'
        class={`${defaultStyles.input} ${commonStyles['sr-only']}`}
        onChange={(event) => props.onChange(event)}
        checked={props.checked}
      />
      <span class={defaultStyles.display}></span>
    </label>
  );
}
