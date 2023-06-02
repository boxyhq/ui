const code = `<script setup>
import { Login } from '@boxyhq/vue2-ui/sso';
import './CustomStyling.css';
function onSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
  cb(null);
}
</script>
<template>
  <Login
    :onSubmit="onSubmit"
    :styles="{
      input: { borderColor: '#ebedf0' },
      button: { padding: '.85rem' },
    }"
    :classNames="{ button: 'btn', input: 'inp' }"
    placeholder="contoso@boxyhq.com"
    inputLabel="Team Domain *"
    buttonText="Login with SSO"
    :innerProps="{ input: { type: 'email' } }" />
</template>
`;

export default code;
