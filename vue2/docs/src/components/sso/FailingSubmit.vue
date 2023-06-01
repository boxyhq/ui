<script setup>
import { Login } from '@boxyhq/vue2-ui/sso';

async function onSubmit({ ssoIdentifier, cb }) {
  console.log(ssoIdentifier);
  cb({
    error: {
      message: 'Invalid team domain',
    },
  });
}
</script>

<template>
  <Login :onSubmit="onSubmit" inputLabel="Team domain *" placeholder="contoso@boxyhq.com" />
</template>
