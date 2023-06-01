<script setup>
import { Login } from '@boxyhq/vue-ui/sso';

function onSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
}
</script>

<template>
  <Login :onSubmit="onSubmit" ssoIdentifier="some-identifier" buttonText="SIGN IN WITH SSO" />
</template>
