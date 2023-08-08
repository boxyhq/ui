import { useStore } from '@builder.io/mitosis';
import IconButton from '../IconButton/index.lite';
import CopytoClipboardIcon from '../icons/CopytoClipboardIcon.lite';
import defaultStyles from './index.module.css';

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
      iconClasses={defaultStyles.icon}
      onClick={() => state.onClick()}
    />
  );
}
