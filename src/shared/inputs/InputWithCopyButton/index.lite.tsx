import { useStore } from '@builder.io/mitosis';
import styles from '../index.module.css';
import CopyToClipboardButton from '../../ClipboardButton/index.lite';
import cssClassAssembler from '../../../sso/utils/cssClassAssembler';
import Spacer from '../../Spacer/index.lite';

interface PropsType {
  text: string;
  label: string;
  copyDoneCallback?: (info: { operation: 'COPY' }) => void;
  classNames?: {
    container?: string;
    label?: string;
    input?: string;
  };
}

export default function InputWithCopyButton(props: PropsType) {
  const state = useStore({
    id: props.label.replace(/ /g, ''),
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, styles.container),
        input: cssClassAssembler(props.classNames?.input, styles.input),
        label: cssClassAssembler(props.classNames?.label, styles.label),
      };
    },
  });
  return (
    <div class={state.classes.container}>
      <div class={styles.labelWithCopy}>
        <label class={state.classes.label} for={state.id}>
          {props.label}
        </label>
        <CopyToClipboardButton successCallback={props.copyDoneCallback} text={props.text} />
      </div>
      <Spacer y={2} />
      <input id={state.id} type='text' value={props.text} readOnly class={state.classes.input} />
    </div>
  );
}
