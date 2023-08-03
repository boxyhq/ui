import { useStore } from '@builder.io/mitosis';
import { SecretInputFormControlProps } from '../types';
import CopyToClipboardButton from '../ClipboardButton/index.lite';
import IconButton from '../IconButton/index.lite';
import EyeIcon from '../icons/EyeIcon.lite';
import EyeSlashIcon from '../icons/EyeSlashIcon.lite';

export default function SecretInputFormControl(props: SecretInputFormControlProps) {
  const state = useStore({
    isSecretShown: false,
  });

  return (
    <div class='mb-6'>
      <div class='flex items-center justify-between'>
        <label
          htmlFor={props.id}
          class={`mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 ${props.isHiddenClassName}`}>
          {props.label}
        </label>
        <div class='flex'>
          <IconButton
            Icon={state.isSecretShown ? EyeSlashIcon : EyeIcon}
            iconClasses='hover:text-primary mr-2'
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
        required={props.required}
        maxLength={props.maxLength}
        readOnly={props.readOnly}
        class={`input-bordered input w-full ${props.isHiddenClassName} ${
          props.readOnly ? ' bg-gray-50' : ''
        }`}
      />
    </div>
  );
}
