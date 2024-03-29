import { useStore } from '@builder.io/mitosis';
import styles from './index.module.css';

export default function Checkbox(props: {
  label: string;
  name: string;
  id?: string;
  checked: boolean;
  handleChange: (e: any) => void;
}) {
  const state = useStore({
    get id() {
      return props.id ? props.id : props.label.replace(/ /g, '');
    },
  });

  return (
    <label class={styles.label}>
      <input
        type='checkbox'
        id={state.id}
        name={props.name}
        checked={props.checked}
        onChange={(event) => props.handleChange(event)}
        class={styles.checkbox}
      />
      {props.label}
    </label>
  );
}
