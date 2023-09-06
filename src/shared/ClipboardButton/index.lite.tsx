import { useStore } from '@builder.io/mitosis';
import IconButton from '../IconButton/index.lite';

interface PropsType {
  text: string;
  copyDoneCallback: () => void;
}

export default function CopyToClipboardButton(props: PropsType) {
  const state = useStore({
    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
    },
    handleClick: () => {
      state.copyToClipboard(props.text);
      props.copyDoneCallback();
    },
  });
  return (
    <IconButton
      label='Copy'
      handleClick={state.handleClick}
      icon="CopytoClipboardIcon"
    ></IconButton>
  );
}
