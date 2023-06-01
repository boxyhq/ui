<script setup>
import { Login } from '@boxyhq/vue-ui/sso';
import './demo1.css';
function onSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
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
