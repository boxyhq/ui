import { useStore } from '@builder.io/mitosis';
import styles from './index.module.css';
import CopyToClipboardButton from '@/shared/CopyToClipboardButton/index.lite';

interface PropsType {
  text: string;
  label: string;
  copyDoneCallback: () => void;
  classNames?: {
    label?: string;
    input?: string;
  };
}

export default function InputWithCopyButton(props: PropsType) {
  const state = useStore({
    id: props.label.replace(/ /g, ''),
    get classes() {
      return {
        label: styles.label + (props.classNames?.label ? ` ${props.classNames.label}` : ''),
        input: styles.input + (props.classNames?.input ? ` ${props.classNames.input}` : ''),
      };
    },
  });
  return (
    <div>
      <div class={`${styles.flex} ${styles['justify-between']}`}>
        <label class={state.classes.label} for={state.id}>
          {props.label}
        </label>
        <CopyToClipboardButton copyDoneCallback={props.copyDoneCallback} text={props.text} />
      </div>
      <input id={state.id} type='text' value={props.text} readOnly class={state.classes.input} />
    </div>
  );
}
