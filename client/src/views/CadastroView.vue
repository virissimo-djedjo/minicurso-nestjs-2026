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
  cep: '',
});
const endereco = ref(null);
const cepErrorMessage = ref('');
const errorMessage = ref('');
const isSending = ref(false);

async function getEnderecoByCep() {
  endereco.value = null;
  cepErrorMessage.value = '';
  if (!usuario.cep) {
    return;
  }
  try {
    const { data } = await api.get(`/enderecos/${usuario.cep}`);
    endereco.value = data;
  } catch (error) {
    cepErrorMessage.value = getErrorMessage(error);
  }
}

async function cadastrarUsuario() {
  errorMessage.value = '';
  isSending.value = true;
  try {
    await api.post('/usuarios', { ...usuario, cep: usuario.cep || undefined });
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
      <label>
        CEP (opcional)
        <input v-model="usuario.cep" placeholder="00000-000" @blur="getEnderecoByCep" />
      </label>
      <p v-if="cepErrorMessage" class="error-message">{{ cepErrorMessage }}</p>
      <p v-if="endereco" class="endereco">
        {{ endereco.logradouro }}{{ endereco.logradouro ? ', ' : '' }}{{ endereco.bairro }}
        · {{ endereco.cidade }} - {{ endereco.estado }}
      </p>
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

.endereco {
  margin: 0;
  padding: 8px 12px;
  border-radius: var(--radius);
  background: var(--color-background);
  font-size: 14px;
}

.footer {
  margin-bottom: 0;
  font-size: 14px;
  color: var(--color-muted);
}
</style>
