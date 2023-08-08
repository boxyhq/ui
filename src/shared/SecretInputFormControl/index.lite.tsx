import { useStore } from '@builder.io/mitosis';
import { SecretInputFormControlProps } from '../types';
import CopyToClipboardButton from '@/shared/CopyToClipboardButton/index.lite';
import IconButton from '@/shared/IconButton/index.lite';
import EyeIcon from '@/shared/icons/EyeIcon.lite';
import EyeSlashIcon from '@/shared/icons/EyeSlashIcon.lite';
import defaultStyles from './index.module.css';

export default function SecretInputFormControl(props: SecretInputFormControlProps) {
  const state = useStore({
    isSecretShown: false,
    handleChange(event: Event) {
      props.cb(event);
    },
  });

  return (
    <div>
      <div class={defaultStyles.toolbar}>
        <label htmlFor={props.id} class={defaultStyles.label}>
          {props.label}
        </label>
        <div>
          <IconButton
            slotIcon={
              state.isSecretShown ? (
                <EyeSlashIcon svgElmtProps={{ 'aria-hidden': true }} classNames={defaultStyles.icon} />
              ) : (
                <EyeIcon svgElmtProps={{ 'aria-hidden': true }} classNames={defaultStyles.icon} />
              )
            }
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
    </div>
  );
}
