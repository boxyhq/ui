import type { JSX } from '@builder.io/mitosis/jsx-runtime';

import { useStore } from '@builder.io/mitosis';
import styles from './index.module.css';
import Spacer from '../../Spacer/index.lite';
import cssClassAssembler from '../../../sso/utils/cssClassAssembler';

type TextAreaProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  classNames?: { textarea?: string; label?: string; container?: string };
  handleInputChange: (e: any) => void;
} & JSX.InputHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea(props: TextAreaProps) {
  const state = useStore({
    get textAreaHTMLAttributes() {
      const { type, name, id, value, handleInputChange, ...rest } = props;
      return rest;
    },
    get cssClass() {
      return {
        container: cssClassAssembler(props.classNames?.container, styles.container),
        textarea: cssClassAssembler(props.classNames?.textarea, styles.textarea),
        label: cssClassAssembler(props.classNames?.label, styles.label),
      };
    },
  });
  return (
    <div class={styles.container}>
      <label for={props.id} class={styles.label}>
        {props.label}
      </label>
      <Spacer y={2} />
      <textarea
        name={props.name}
        id={props.id}
        value={props.value}
        class={state.cssClass.textarea}
        onChange={(event) => props.handleInputChange(event)}
        {...state.textAreaHTMLAttributes}></textarea>
    </div>
  );
}
