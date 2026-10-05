<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api, getErrorMessage } from '../api';

const router = useRouter();
const usuario = reactive({
  nome: '',
  sobrenome: '',
  nomeUsuario: '',
  email: '',
  senha: '',
  cpf: '',
  dataNascimento: '',
});
const errorMessage = ref('');
const isSending = ref(false);

async function cadastrarUsuario() {
  errorMessage.value = '';
  isSending.value = true;
  try {
    await api.post('/usuarios', usuario);
    router.push('/login');
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isSending.value = false;
  }
}
</script>

<template>
  <section class="card">
    <h1>Criar conta</h1>
    <form class="form" @submit.prevent="cadastrarUsuario">
      <div class="row">
        <label>
          Nome
          <input v-model="usuario.nome" required />
        </label>
        <label>
          Sobrenome
          <input v-model="usuario.sobrenome" required />
        </label>
      </div>
      <label>
        Nome de usuário
        <input v-model="usuario.nomeUsuario" required />
      </label>
      <label>
        E-mail
        <input v-model="usuario.email" type="email" required />
      </label>
      <label>
        Senha
        <input v-model="usuario.senha" type="password" minlength="8" required />
      </label>
      <div class="row">
        <label>
          CPF
          <input v-model="usuario.cpf" required />
        </label>
        <label>
          Data de nascimento
          <input v-model="usuario.dataNascimento" type="date" required />
        </label>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" :disabled="isSending">Criar conta</button>
    </form>
    <p class="footer">
      Já tem conta? <RouterLink to="/login">Entrar</RouterLink>
    </p>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 0;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.footer {
  margin-bottom: 0;
  font-size: 14px;
  color: var(--color-muted);
}
</style>
