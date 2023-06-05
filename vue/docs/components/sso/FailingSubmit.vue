<script setup>
import { Login } from '@boxyhq/vue-ui/sso';

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
  <Login
    :onSubmit="onSubmit"
    inputLabel="Team domain *"
    placeholder="contoso@boxyhq.com"
    :innerProps="{ input: { id: 'demo4-input' }, label: { for: 'demo4-input' } }" />
</template>
