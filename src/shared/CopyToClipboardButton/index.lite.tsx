import { useStore } from '@builder.io/mitosis';
import IconButton from '@/shared/IconButton/index.lite';
import CopytoClipboardIcon from '@/shared/icons/CopytoClipboardIcon.lite';
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
      slotIcon={
        <CopytoClipboardIcon svgElmtProps={{ 'aria-hidden': true }} classNames={defaultStyles.icon} />
      }
      onClick={() => state.onClick()}></IconButton>
  );
}
