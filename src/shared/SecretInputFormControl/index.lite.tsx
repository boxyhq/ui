import { useStore } from '@builder.io/mitosis';
import { SecretInputFormControlProps } from '../types';
import CopyToClipboardButton from '../ClipboardButton/index.lite';
import IconButton from '../IconButton/index.lite';
import EyeIcon from '../icons/EyeIcon.lite';
import EyeSlashIcon from '../icons/EyeSlashIcon.lite';
import defaultStyles from './index.module.css';

export default function SecretInputFormControl(props: SecretInputFormControlProps) {
  const state = useStore({
    isSecretShown: false,
    handleChange(event: Event) {
      props.cb(event);
    },
  });

  return (
    <>
      <div class={defaultStyles.toolbar}>
        <label htmlFor={props.id} class={defaultStyles.label}>
          {props.label}
        </label>
        <div>
          <IconButton
            Icon={state.isSecretShown ? EyeSlashIcon : EyeIcon}
            iconClasses={defaultStyles.icon}
            onClick={() => (state.isSecretShown = !state.isSecretShown)}
          />
          <CopyToClipboardButton text={props.value} toastSuccessCallback={props.successCallback} />
        </div>
      </div>
      <input
        type={state.isSecretShown ? 'text' : 'password'}
        placeholder={props.placeholder}
        value={props.value || ''}
        id={props.id}
        name={props.id}
        required={props.required}
        maxLength={props.maxLength}
        readOnly={props.readOnly}
        onInput={(event) => state.handleChange(event)}
        class={defaultStyles.input}
      />
    </>
  );
}
