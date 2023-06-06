<template>
  <pre><code class="language-js"><slot></slot></code></pre>
</template>

<script setup>
import { onMounted } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-twilight.css';

onMounted(() => {
  Prism.highlightAll();
});
// onUpdated(() => {
//   Prism.highlightAll();
// });
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  pre {
    max-width: 60vw;
  }
}
</style>
