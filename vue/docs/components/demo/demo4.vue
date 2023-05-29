<script setup>
import { Login } from '@boxyhq/vue-ui/sso';

async function onSubmit(ssoIdentifier, errorCallback) {
  console.log(ssoIdentifier);
  errorCallback({
    error: {
      message: 'Invalid team domain',
    },
  });
}
</script>

<template>
  <Login :onSubmit="onSubmit" inputLabel="Team domain *" placeholder="contoso@boxyhq.com" />
</template>
