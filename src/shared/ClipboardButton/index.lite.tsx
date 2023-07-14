import { useStore } from '@builder.io/mitosis';
import IconButton from '../IconButton/index.lite';
import CopytoClipboardIcon from '../icons/CopytoClipboardIcon.lite';

interface PropsType {
  text: string;
  translation: any;
  toastSuccessCallback: () => void;
}

export default function CopyToClipboardButton(props: PropsType) {
  const state = useStore({
    get label() {
      return props.translation('copy');
    },
    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
    },
    onClick: () => {
      state.copyToClipboard(props.text);
      props.toastSuccessCallback();
    },
  });
  return (
    <IconButton
      label={state.label}
      Icon={CopytoClipboardIcon}
      iconClasses='hover:text-primary'
      onClick={state.onClick}
    />
  );
}
