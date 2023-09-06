import { Show, useStore } from '@builder.io/mitosis';
import { SecretInputFormControlProps } from '../types';
import CopyToClipboardButton from '../ClipboardButton/index.lite';
import IconButton from '../IconButton/index.lite';
import EyeIcon from '../icons/EyeIcon.lite';
import EyeSlashIcon from '../icons/EyeSlashIcon.lite';
import defaultStyles from './index.module.css';
import Spacer from '../Spacer/index.lite';

export default function SecretInputFormControl(props: SecretInputFormControlProps) {
  const state = useStore({
    isSecretShown: false,
    toggleIsSecretShown() {
      state.isSecretShown = !state.isSecretShown;
    },
    onChange: (event: Event) => {
      props.handleChange(event);
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
            handleClick={state.toggleIsSecretShown}
            label={state.isSecretShown ? 'Hide secret' : 'Show secret'}
          >
            <Show when={state.isSecretShown} else={<EyeIcon aria-hidden={true} />}>
              <EyeSlashIcon aria-hidden={true} />
            </Show>
          </IconButton>
          <Spacer x={2} />
          <CopyToClipboardButton text={props.value} copyDoneCallback={props.copyDoneCallback} />
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
        onChange={(event) => state.onChange(event)}
        class={defaultStyles.input}
      />
    </div>
  );
}
