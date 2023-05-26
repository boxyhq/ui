import { useStore, Show } from '@builder.io/mitosis';
import type { LoginProps } from './types';
import getUniqueId from './utils/getUniqueId';
import defaultClasses from './index.module.css';
import cssClassAssembler from './utils/cssClassAssembler';

const COMPONENT = 'sso';

const DEFAULT_VALUES = {
  ssoIdentifier: '',
  inputLabel: 'Tenant',
  placeholder: '',
  buttonText: 'Sign-in with SSO',
};

export default function Login(props: LoginProps) {
  const state: any = useStore({
    _ssoIdentifier: DEFAULT_VALUES.ssoIdentifier,
    errMsg: '',
    isProcessing: false,
    get isError() {
      return !!state.errMsg;
    },
    get disableButton() {
      return !(state._ssoIdentifier || props.ssoIdentifier) || state.isProcessing;
    },
    get shouldRenderInput() {
      return !props.ssoIdentifier;
    },
    get InputId() {
      return getUniqueId(COMPONENT, 'input');
    },
    get ErrorSpanId() {
      return getUniqueId(COMPONENT, 'span');
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        input: cssClassAssembler(props.classNames?.input, defaultClasses.input),
        button: cssClassAssembler(props.classNames?.button, defaultClasses.button),
      };
    },
    handleChange(event) {
      state.errMsg = '';
      state._ssoIdentifier = event.currentTarget.value;
    },
    onSubmitButton(event) {
      void (async function (e) {
        e.preventDefault();
        state.isProcessing = true;
        const {
          error: { message },
        } = (await props.onSubmit(state._ssoIdentifier || props.ssoIdentifier)) || {
          error: {},
        };
        state.isProcessing = false;
        if (typeof message === 'string' && message) {
          state.errMsg = message;
        }
      })(event);
    },
  });

  return (
    <div style={props.styles?.container} class={state.classes.container} {...props.innerProps?.container}>
      <Show when={state.shouldRenderInput}>
        <label
          htmlFor={state.InputId}
          style={props.styles?.label}
          class={state.classes.label}
          {...props.innerProps?.label}>
          {props.inputLabel || DEFAULT_VALUES.inputLabel}
        </label>
        <input
          id={state.InputId}
          value={state._ssoIdentifier}
          placeholder={props.placeholder || DEFAULT_VALUES.placeholder}
          onChange={(e) => state.handleChange(e)}
          style={props.styles?.input}
          class={state.classes.input}
          aria-invalid={state.isError}
          aria-describedby={state.ErrorSpanId}
          {...props.innerProps?.input}
        />
        <Show when={state.isError}>
          <span id={state.ErrorSpanId}>{state.errMsg}</span>
        </Show>
      </Show>
      <button
        disabled={state.disableButton}
        type='button'
        onClick={(e) => state.onSubmitButton(e)}
        style={props.styles?.button}
        class={state.classes.button}
        {...props.innerProps?.button}>
        {props.buttonText || DEFAULT_VALUES.buttonText}
      </button>
    </div>
  );
}
