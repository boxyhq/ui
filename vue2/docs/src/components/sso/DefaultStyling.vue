<script setup>
import { Login } from '@boxyhq/vue2-ui/sso';

function onSubmit({ ssoIdentifier, cb }) {
  // initiate the SSO flow here
  console.log(ssoIdentifier);
  cb(null);
}
</script>

<template>
  <Login
    :onSubmit="onSubmit"
    :styles="{ input: { border: '1px solid darkcyan' } }"
    inputLabel="Team domain *"
    placeholder="contoso@boxyhq.com" />
</template>
