<script setup>
import { useRouter } from 'vue-router';
import { clearAccessToken, isLoggedIn } from './session';

const router = useRouter();

function logout() {
  clearAccessToken();
  router.push('/login');
}
</script>

<template>
  <header class="header">
    <span class="brand">Rede do Minicurso</span>
    <nav v-if="isLoggedIn" class="nav">
      <RouterLink to="/perfil">Perfil</RouterLink>
      <button class="button-secondary" @click="logout">Sair</button>
    </nav>
  </header>
  <main class="content">
    <RouterView />
  </main>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-weight: 700;
  color: var(--color-primary);
}

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
}

.nav a.router-link-active {
  color: var(--color-primary);
}

.content {
  max-width: 640px;
  margin: 32px auto;
  padding: 0 16px;
}
</style>
