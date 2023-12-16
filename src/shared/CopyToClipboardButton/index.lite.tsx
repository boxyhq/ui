import { useStore } from '@builder.io/mitosis';
import IconButton from '../IconButton/index.lite';

interface PropsType {
  text: string;
  successCallback?: (info: any) => void;
}

export default function CopyToClipboardButton(props: PropsType) {
  const state = useStore({
    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
    },
    handleClick: () => {
      state.copyToClipboard(props.text);
      typeof props.successCallback === 'function' && props.successCallback({ operation: 'COPY' });
    },
  });
  return <IconButton label='Copy' handleClick={state.handleClick} icon='CopytoClipboardIcon'></IconButton>;
}
