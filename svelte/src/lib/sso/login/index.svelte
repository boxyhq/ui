<script lang="ts">
  import type { LoginProps } from "./types";
  import getUniqueId from "../utils/getUniqueId";
  import cssClassAssembler from "../utils/cssClassAssembler";
  import defaultClasses from "./index.module.css";
  const COMPONENT = "sso";
  const DEFAULT_VALUES = {
    ssoIdentifier: "",
    inputLabel: "Tenant",
    placeholder: "",
    buttonText: "Sign-in with SSO",
  };

  export let ssoIdentifier: LoginProps["ssoIdentifier"];
  export let classNames: LoginProps["classNames"];
  export let onSubmit: LoginProps["onSubmit"];
  export let styles: LoginProps["styles"];
  export let innerProps: LoginProps["innerProps"];
  export let inputLabel: LoginProps["inputLabel"];
  export let placeholder: LoginProps["placeholder"];
  export let buttonText: LoginProps["buttonText"];

  function mitosis_styling(node, vars) {
    Object.entries(vars || {}).forEach(([p, v]) => {
      if (p.startsWith("--")) {
        node.style.setProperty(p, v);
      } else {
        node.style[p] = v;
      }
    });
  }

  function handleChange(event: Event) {
    errMsg = "";
    _ssoIdentifier = (event.currentTarget as HTMLInputElement)?.value;
  }
  function onSubmitButton(event: Event) {
    event.preventDefault();
    isProcessing = true;
    const ssoIdentifierToSubmit = (_ssoIdentifier || ssoIdentifier) ?? "";
    onSubmit({
      ssoIdentifier: ssoIdentifierToSubmit,
      cb: (err) => {
        isProcessing = false;
        if (err?.error.message) {
          errMsg = err.error.message;
        }
      },
    });
  }
  $: isError = () => {
    return !!errMsg;
  };
  $: disableButton = () => {
    return !(_ssoIdentifier || ssoIdentifier) || isProcessing;
  };
  $: shouldRenderInput = () => {
    return !ssoIdentifier;
  };
  $: InputId = () => {
    return getUniqueId(COMPONENT, "input");
  };
  $: ErrorSpanId = () => {
    return getUniqueId(COMPONENT, "span");
  };
  $: classes = () => {
    return {
      container: cssClassAssembler(
        classNames?.container,
        defaultClasses.container
      ),
      label: cssClassAssembler(classNames?.label, defaultClasses.label),
      input: cssClassAssembler(classNames?.input, defaultClasses.input),
      button: cssClassAssembler(classNames?.button, defaultClasses.button),
    };
  };

  let _ssoIdentifier = DEFAULT_VALUES.ssoIdentifier;
  let errMsg = "";
  let isProcessing = false;
</script>

<div
  use:mitosis_styling={styles?.container}
  class={classes().container}
  {...innerProps?.container}
>
  {#if shouldRenderInput()}
    <label
      use:mitosis_styling={styles?.label}
      for={InputId()}
      class={classes().label}
      {...innerProps?.label}
    >
      {inputLabel || DEFAULT_VALUES.inputLabel}
    </label>

    <input
      use:mitosis_styling={styles?.input}
      id={InputId()}
      value={_ssoIdentifier}
      placeholder={placeholder || DEFAULT_VALUES.placeholder}
      on:input={(event) => {
        handleChange(event);
      }}
      class={classes().input}
      aria-invalid={isError()}
      aria-describedby={ErrorSpanId()}
      {...innerProps?.input}
    />

    {#if isError()}
      <span id={ErrorSpanId()}>{errMsg}</span>
    {/if}
  {/if}
  <button
    use:mitosis_styling={styles?.button}
    type="button"
    disabled={disableButton()}
    on:click={(event) => {
      onSubmitButton(event);
    }}
    class={classes().button}
    {...innerProps?.button}
  >
    {buttonText || DEFAULT_VALUES.buttonText}
  </button>
</div>