import { useStore } from '@builder.io/mitosis';
import IconButton from '../IconButton/index.lite';
import CopytoClipboardIcon from '../icons/CopytoClipboardIcon.lite';

interface PropsType {
  text: string;
  toastSuccessCallback: () => void;
}

export default function CopyToClipboardButton(props: PropsType) {
  const state = useStore({
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
      label='Copy'
      Icon={CopytoClipboardIcon}
      iconClasses='hover:text-primary'
      onClick={state.onClick}
    />
  );
}
