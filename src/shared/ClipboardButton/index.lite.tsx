import { useStore } from '@builder.io/mitosis';
import IconButton from '../IconButton/index.lite';
import baseStyles from './common.module.css';
import styles from './index.module.css';
import CopytoClipboardIcon from '../icons/CopytoClipboardIcon.lite';

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export const CopyToClipboardButton = ({
  text,
  translation,
  toastSuccessCallback,
}: {
  text: string;
  translation: any;
  toastSuccessCallback: () => void;
}) => {
  return (
    <IconButton
      label={translation('copy')}
      Icon={CopytoClipboardIcon}
      iconClasses='hover:text-primary'
      onClick={() => {
        copyToClipboard(text);
        toastSuccessCallback();
      }}></IconButton>
  );
};

export function InputWithCopyButton({
  text,
  label,
  translation,
  toastSuccessCallback,
  classNames,
}: {
  text: string;
  label: string;
  translation: any;
  toastSuccessCallback: () => void;
  classNames: {
    label: string;
    input: string;
  };
}) {
  const state = useStore({
    id: label.replace(/ /g, ''),
    get classes() {
      return {
        label: styles.label + (classNames?.label ? ` ${classNames.label}` : ''),
        input: baseStyles.input + (classNames?.input ? ` ${classNames.input}` : ''),
      };
    },
  });
  return (
    <>
      <div class={`${baseStyles.flex} ${baseStyles['justify-between']}`}>
        <label class={state.classes.label} for={state.id}>
          {label}
        </label>
        <CopyToClipboardButton
          toastSuccessCallback={toastSuccessCallback}
          translation={translation}
          text={text}
        />
      </div>
      <input id={state.id} type='text' value={text} key={text} readOnly class={state.classes.input} />
    </>
  );
}
