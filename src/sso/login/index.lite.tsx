import { useState, useStore, Show } from '@builder.io/mitosis';
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
  const [ssoIdentifierState, setSsoIdentifierState] = useState('');
  // const [ssoIdentifierPrivate, setSsoIdentifierPrivate] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const state = useStore({
    get InputId() {
      return getUniqueId(COMPONENT, 'input');
    },
    get ErrorSpanId() {
      return getUniqueId(COMPONENT, 'span');
    },
    isError: !!errMsg,
    shouldRenderInput: !(props.ssoIdentifier || DEFAULT_VALUES.ssoIdentifier),
    disableButton:
      !(ssoIdentifierState || props.ssoIdentifier || DEFAULT_VALUES.ssoIdentifier) || isProcessing,

    // input event listeners
    // handle on change of element
    handleChange: (e) => {
      setErrMsg('');
      setSsoIdentifierState(e.currentTarget.value);
    },

    // handle submission
    onSubmitButton: (event) => {
      void (async function (e) {
        e.preventDefault();
        setIsProcessing(true);
        const {
          error: { message },
        } = (await props.onSubmit(
          ssoIdentifierState || props.ssoIdentifier || DEFAULT_VALUES.ssoIdentifier
        )) || {
          error: {},
        };
        setIsProcessing(false);
        if (typeof message === 'string' && message) {
          setErrMsg(message);
        }
      })(event);
    },
  });

  return (
    <div
      style={props.styles?.container}
      class={cssClassAssembler(props.classNames?.container, defaultClasses.container)}
      {...props.innerProps?.container}>
      <Show when={state.shouldRenderInput}>
        <>
          <label
            htmlFor={state.InputId}
            style={props.styles?.label}
            className={cssClassAssembler(props.classNames?.label, defaultClasses.label)}
            {...props.innerProps?.label}>
            {props.inputLabel || DEFAULT_VALUES.inputLabel}
          </label>
          <input
            id={state.InputId}
            value={ssoIdentifierState}
            placeholder={props.placeholder || DEFAULT_VALUES.placeholder}
            onChange={(e) => state.handleChange(e)}
            style={props.styles?.input}
            class={cssClassAssembler(props.classNames?.input, defaultClasses.input)}
            aria-invalid={state.isError}
            aria-describedby={state.ErrorSpanId}
            {...props.innerProps?.input}
          />
          <Show when={state.isError}>
            <span id={state.ErrorSpanId}>{errMsg}</span>
          </Show>
        </>
      </Show>
      <button
        disabled={state.disableButton}
        type='button'
        onClick={(e) => state.onSubmitButton(e)}
        style={props.styles?.button}
        class={cssClassAssembler(props.classNames?.button, defaultClasses.button)}
        {...props.innerProps?.button}>
        {props.buttonText || DEFAULT_VALUES.buttonText}
      </button>
    </div>
  );
}
