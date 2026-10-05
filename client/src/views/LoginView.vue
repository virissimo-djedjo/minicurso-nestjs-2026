<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api, getErrorMessage } from '../api';
import { setAccessToken } from '../session';

const router = useRouter();
const credenciais = reactive({ email: '', senha: '' });
const errorMessage = ref('');
const isSending = ref(false);

async function login() {
  errorMessage.value = '';
  isSending.value = true;
  try {
    const { data } = await api.post('/auth/login', credenciais);
    setAccessToken(data.accessToken);
    router.push('/');
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <section class="card">
    <h1>Entrar</h1>
    <form class="form" @submit.prevent="login">
      <label>
        E-mail
        <input v-model="credenciais.email" type="email" required />
      </label>
      <label>
        Senha
        <input v-model="credenciais.senha" type="password" required />
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" :disabled="isSending">Entrar</button>
    </form>
    <p class="footer">
      Ainda não tem conta? <RouterLink to="/cadastro">Cadastre-se</RouterLink>
    </p>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 0;
}

.footer {
  margin-bottom: 0;
  font-size: 14px;
  color: var(--color-muted);
}
</style>
