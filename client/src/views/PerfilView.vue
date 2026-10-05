<script setup>
import { onMounted, ref } from 'vue';
import { api, getErrorMessage } from '../api';

const perfil = ref(null);
const errorMessage = ref('');

async function getPerfil() {
  try {
    const { data } = await api.get('/usuarios/me');
    perfil.value = data;
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
}

onMounted(getPerfil);
</script>

<template>
  <section class="card">
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <template v-if="perfil">
      <div class="header">
        <img
          v-if="perfil.imagemPerfilUrl"
          class="avatar"
          :src="perfil.imagemPerfilUrl"
          alt="Foto de perfil"
        />
        <div v-else class="avatar avatar-empty">{{ perfil.nome[0] }}</div>
        <div>
          <h1>{{ perfil.nome }} {{ perfil.sobrenome }}</h1>
          <p class="muted">@{{ perfil.nomeUsuario }} · {{ perfil.email }}</p>
        </div>
      </div>
      <p v-if="perfil.endereco" class="muted">
        {{ perfil.endereco.cidade }} - {{ perfil.endereco.estado }}
      </p>
    </template>
  </section>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
}

h1 {
  margin: 0;
  font-size: 22px;
}

.muted {
  margin: 4px 0 0;
  color: var(--color-muted);
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdecef;
  color: var(--color-primary);
  font-size: 40px;
  font-weight: 700;
}
</style>
