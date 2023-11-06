import type { JSX } from '@builder.io/mitosis/jsx-runtime';

import { useStore } from '@builder.io/mitosis';
import styles from './index.module.css';
import Spacer from '../Spacer/index.lite';

type InputProps = {
  type?: 'text' | 'number' | 'email' | 'url';
  id: string;
  name: string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const state = useStore({
    get inputHTMLAttributes() {
      const { type, name, id, ...rest } = props;
      return rest;
    },
  });
  return (
    <div class={styles.container}>
      <label for={props.id} class={styles.label}></label>
      <Spacer y={2} />
      <input
        type={props.type || 'text'}
        name={props.name}
        id={props.id}
        {...state.inputHTMLAttributes}></input>
    </div>
  );
}
