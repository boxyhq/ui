<template>
  <div>
    <aside class="sidebar">
      <nav><router-link to="/components/sso">SSO Login</router-link></nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>
<style>
.sidebar {
  position: fixed;
  background-color: #f6f6f7;
  top: 0;
  bottom: 0;
  left: 0;
  padding: 32px 32px 96px;
  min-width: 180px;
  width: 15vw;
}
.content {
  padding-left: max(20vw, 200px);
}
</style>
