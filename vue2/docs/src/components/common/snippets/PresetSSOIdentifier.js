const code = `<script setup>
import { Login } from '@boxyhq/vue2-ui/sso';

function onSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
  cb(null);
}
</script>

<template>
  <Login :onSubmit="onSubmit" ssoIdentifier="some-identifier" buttonText="SIGN IN WITH SSO" />
</template>`;

export default code;
