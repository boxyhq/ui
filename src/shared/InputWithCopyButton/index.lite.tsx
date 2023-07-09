import { useStore } from '@builder.io/mitosis';
import baseStyles from '../common.module.css';
import styles from './index.module.css';
import CopyToClipboardButton from '../ClipboardButton/index.lite';

interface PropsType {
  text: string;
  label: string;
  translation: any;
  toastSuccessCallback: () => void;
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
        input: baseStyles.input + (props.classNames?.input ? ` ${props.classNames.input}` : ''),
      };
    },
  });
  return (
    <div>
      <div class={`${baseStyles.flex} ${baseStyles['justify-between']}`}>
        <label class={state.classes.label} for={state.id}>
          {props.label}
        </label>
        <CopyToClipboardButton
          toastSuccessCallback={props.toastSuccessCallback}
          translation={props.translation}
          text={props.text}
        />
      </div>
      <input id={state.id} type='text' value={props.text} readOnly class={state.classes.input} />
    </div>
  );
}
