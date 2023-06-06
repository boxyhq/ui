# @boxyhq/vue2-ui

UI components from [BoxyHQ](https://boxyhq.com/) for plug-and-play enterprise features.

## Installation

`npm install @boxyhq/vue2-ui --save`

## Usage

### SSO Login Component

There are mainly 2 ways of using the SSO Login Component as outlined below:

#### Preset value for `ssoIdentifier`

If a value is passed for `ssoIdentifier`, it would render a button that on click calls the passed-in handler (onSubmit) with the `ssoIdentifier` value. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

```vue
<script setup>
import { Login } from '@boxyhq/vue2-ui/sso';

function onSSOSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
}
</script>

<template>
  <Login
    :onSubmit="onSSOSubmit"
    :ssoIdentifier="`tenant=${tenant}&product=${product}`"
    buttonText="Login with SSO"
    :innerProps="{ input: { id: 'sso-input' }, label: { for: 'sso-input' } }" />
</template>
```

#### Accept input from the user for `ssoIdentifier`

If a value is not passed for `ssoIdentifier`, it would render an input field for the user to enter the `ssoIdentifier` value. And then on submit, the value gets passed to the handler. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

```vue
<script setup>
import { Login } from '@boxyhq/vue-ui/sso';
import './CustomStyling.css';
function onSSOSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
}
</script>
<template>
  <Login
    :onSubmit="onSSOSubmit"
    :styles="{
      input: { borderColor: '#ebedf0' },
      button: { padding: '.85rem' },
    }"
    :classNames="{ button: 'btn', input: 'inp' }"
    placeholder="contoso@boxyhq.com"
    inputLabel="Team Domain *"
    buttonText="Login with SSO"
    :innerProps="{ input: { type: 'email', id: 'sso-input' }, label: { for: 'sso-input' } }" />
</template>
```

#### Styling

If the classNames prop is passed in, we can override the default styling for each inner element. In case an inner element is omitted from the classNames prop, default styles will be set for the element. For example, In the below snippet, all the inner elements are styled by passing in the classNames for each inner one.

```vue
<Login
  buttonText="Login with SSO"
  :onSubmit="onSSOSubmit"
  :classNames="{
    container: 'mt-2',
    label: 'text-gray-400',
    button: 'btn-primary btn-block btn rounded-md active:-scale-95',
    input: 'input-bordered input mb-5 mt-2 w-full rounded-md',
  }" />
```

Styling via style attribute is also supported for each inner element.
