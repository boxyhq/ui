import type { JSX } from '@builder.io/mitosis/jsx-runtime';

import { useStore } from '@builder.io/mitosis';
import styles from '../index.module.css';
import Spacer from '../../Spacer/index.lite';
import cssClassAssembler from '../../../sso/utils/cssClassAssembler';

type InputProps = {
  type?: 'text' | 'number' | 'email' | 'url';
  id: string;
  name: string;
  label: string;
  value: string;
  classNames?: { input?: string; label?: string; container?: string };
  handleInputChange?: (e: any) => void;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function InputField(props: InputProps) {
  const state = useStore({
    get inputHTMLAttributes() {
      const { type, name, id, value, handleInputChange, classNames, ...rest } = props;
      return rest;
    },
    get cssClass() {
      return {
        container: cssClassAssembler(props.classNames?.container, styles.container),
        input: cssClassAssembler(props.classNames?.input, styles.input),
        label: cssClassAssembler(props.classNames?.label, styles.label),
      };
    },
  });

  return (
    <div class={state.cssClass.container}>
      <label for={props.id} class={state.cssClass.label}>
        {props.label}
      </label>
      <Spacer y={2} />
      <input
        type={props.type || 'text'}
        name={props.name}
        id={props.id}
        value={props.value}
        class={state.cssClass.input}
        onChange={(event) => typeof props.handleInputChange === 'function' && props.handleInputChange(event)}
        {...state.inputHTMLAttributes}></input>
    </div>
  );
}
