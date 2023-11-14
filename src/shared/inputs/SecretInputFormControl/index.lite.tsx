import { useStore } from '@builder.io/mitosis';
import { SecretInputFormControlProps } from '../../types';
import CopyToClipboardButton from '../../ClipboardButton/index.lite';
import IconButton from '../../IconButton/index.lite';
import defaultStyles from './index.module.css';
import Spacer from '../../Spacer/index.lite';
import cssClassAssembler from '../../../sso/utils/cssClassAssembler';

export default function SecretInputFormControl(props: SecretInputFormControlProps) {
  const state = useStore({
    isSecretShown: false,
    toggleIsSecretShown() {
      state.isSecretShown = !state.isSecretShown;
    },
    onChange: (event: Event) => {
      props.handleChange(event);
    },
    get classes() {
      return {
        input: cssClassAssembler(props.classNames?.input, defaultStyles.input),
      };
    },
  });

  return (
    <div class={defaultStyles.container}>
      <div class={defaultStyles.toolbar}>
        <label htmlFor={props.id} class={defaultStyles.label}>
          {props.label}
        </label>
        <div>
          <IconButton
            handleClick={state.toggleIsSecretShown}
            label={state.isSecretShown ? 'Hide secret' : 'Show secret'}
            icon={state.isSecretShown ? 'EyeSlashIcon' : 'EyeIcon'}></IconButton>
          <Spacer x={0.5} />
          <CopyToClipboardButton text={props.value || ''} successCallback={props.copyDoneCallback} />
        </div>
      </div>
      <Spacer y={2} />
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
        class={state.classes.input}
      />
    </div>
  );
}
