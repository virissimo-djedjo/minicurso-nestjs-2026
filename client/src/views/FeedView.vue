<script setup>
import { onMounted, reactive, ref } from 'vue';
import { api, getErrorMessage } from '../api';
import { usuarioId } from '../session';

const FEED_LIMIT = 20;

const publicacoes = ref([]);
const page = ref(1);
const hasMorePublicacoes = ref(false);
const errorMessage = ref('');
const novaPublicacao = reactive({ conteudo: '', imagem: null });
const isPublishing = ref(false);
const comentariosByPublicacaoId = reactive({});
const novoComentarioByPublicacaoId = reactive({});

async function getFeed() {
  try {
    const { data } = await api.get('/publicacoes', {
      params: { page: page.value, limit: FEED_LIMIT },
    });
    publicacoes.value.push(...data);
    hasMorePublicacoes.value = data.length === FEED_LIMIT;
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
}

function getNextPage() {
  page.value += 1;
  getFeed();
}

function selectImagem(event) {
  [novaPublicacao.imagem] = event.target.files;
}

async function publish(event) {
  errorMessage.value = '';
  isPublishing.value = true;
  try {
    const formData = new FormData();
    formData.append('conteudo', novaPublicacao.conteudo);
    if (novaPublicacao.imagem) {
      formData.append('imagem', novaPublicacao.imagem);
    }
    const { data } = await api.post('/publicacoes', formData);
    publicacoes.value.unshift(data);
    novaPublicacao.conteudo = '';
    novaPublicacao.imagem = null;
    event.target.reset();
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isPublishing.value = false;
  }
}

async function deletePublicacao(publicacao) {
  errorMessage.value = '';
  try {
    await api.delete(`/publicacoes/${publicacao.id}`);
    publicacoes.value = publicacoes.value.filter(({ id }) => id !== publicacao.id);
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
}

async function toggleComentarios(publicacaoId) {
  if (comentariosByPublicacaoId[publicacaoId]) {
    delete comentariosByPublicacaoId[publicacaoId];
    return;
  }
  try {
    const { data } = await api.get(`/publicacoes/${publicacaoId}/comentarios`);
    comentariosByPublicacaoId[publicacaoId] = data;
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
}

async function comentar(publicacaoId) {
  errorMessage.value = '';
  try {
    const { data } = await api.post(`/publicacoes/${publicacaoId}/comentarios`, {
      conteudo: novoComentarioByPublicacaoId[publicacaoId] ?? '',
    });
    comentariosByPublicacaoId[publicacaoId].push(data);
    novoComentarioByPublicacaoId[publicacaoId] = '';
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
}

function formatCreatedAt(createdAt) {
  return new Date(createdAt).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

onMounted(getFeed);
</script>

<template>
  <form class="card publish-form" @submit.prevent="publish">
    <textarea
      v-model="novaPublicacao.conteudo"
      maxlength="1000"
      rows="3"
      placeholder="O que está acontecendo?"
    />
    <div class="publish-actions">
      <input type="file" accept="image/*" @change="selectImagem" />
      <button :disabled="isPublishing">Publicar</button>
    </div>
  </form>
  <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  <article v-for="publicacao in publicacoes" :key="publicacao.id" class="card publicacao">
    <header class="autor">
      <img
        v-if="publicacao.autor.imagemPerfilUrl"
        class="avatar"
        :src="publicacao.autor.imagemPerfilUrl"
        alt="Foto do autor"
      />
      <div v-else class="avatar avatar-empty">{{ publicacao.autor.nomeUsuario[0] }}</div>
      <div class="autor-info">
        <strong>@{{ publicacao.autor.nomeUsuario }}</strong>
        <span class="muted">{{ formatCreatedAt(publicacao.createdAt) }}</span>
      </div>
      <button
        v-if="publicacao.autor.id === String(usuarioId)"
        class="button-secondary delete-button"
        @click="deletePublicacao(publicacao)"
      >
        Excluir
      </button>
    </header>
    <p v-if="publicacao.conteudo" class="conteudo">{{ publicacao.conteudo }}</p>
    <img
      v-if="publicacao.imagemUrl"
      class="imagem"
      :src="publicacao.imagemUrl"
      alt="Imagem da publicação"
    />
    <button class="link-button" @click="toggleComentarios(publicacao.id)">
      {{ comentariosByPublicacaoId[publicacao.id] ? 'Esconder comentários' : 'Ver comentários' }}
    </button>
    <div v-if="comentariosByPublicacaoId[publicacao.id]" class="comentarios">
      <p
        v-for="comentario in comentariosByPublicacaoId[publicacao.id]"
        :key="comentario.id"
        class="comentario"
      >
        <strong>@{{ comentario.autor.nomeUsuario }}</strong> {{ comentario.conteudo }}
      </p>
      <form class="comentario-form" @submit.prevent="comentar(publicacao.id)">
        <input
          v-model="novoComentarioByPublicacaoId[publicacao.id]"
          maxlength="1000"
          placeholder="Escreva um comentário"
        />
        <button>Comentar</button>
      </form>
    </div>
  </article>
  <button v-if="hasMorePublicacoes" class="button-secondary more-button" @click="getNextPage">
    Carregar mais
  </button>
</template>

<style scoped>
.publish-form textarea {
  width: 100%;
  resize: vertical;
  font: inherit;
}

.publish-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.publicacao {
  margin-top: 16px;
}

.autor {
  display: flex;
  align-items: center;
  gap: 12px;
}

.autor-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.muted {
  color: var(--color-muted);
  font-size: 13px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdecef;
  color: var(--color-primary);
  font-weight: 700;
}

.delete-button {
  padding: 4px 10px;
  font-size: 13px;
}

.conteudo {
  white-space: pre-wrap;
}

.imagem {
  display: block;
  max-width: 100%;
  margin-top: 8px;
  border-radius: var(--radius);
}

.link-button {
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
}

.link-button:hover {
  background: none;
}

.comentarios {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.comentario {
  margin: 4px 0;
}

.comentario-form {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.comentario-form input {
  flex: 1;
}

.more-button {
  display: block;
  margin: 16px auto;
}
</style>
