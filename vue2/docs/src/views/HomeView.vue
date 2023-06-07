<template>
  <div class="home">
    <h1 class="header">boxyhq-ui</h1>
    <p class="text">UI components for Vue.js (v2)</p>
    <p class="tagline">Components to ease BoxyHQ integration</p>
  </div>
</template>
<style>
.home {
  line-height: 64px;
  font-weight: 700;
  display: flex;
  max-width: 80%;
  margin: 0 auto;
  flex-direction: column;
  align-items: flex-start;
}
.header {
  font-size: 56px;
  margin: 0;
  color: #25c2a0;
}
.text {
  margin: 0;
  font-size: 56px;
}
.tagline {
  line-height: 36px;
  font-size: 24px;
  color: #3c3c43bf;
}
</style>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {},
};
</script>
