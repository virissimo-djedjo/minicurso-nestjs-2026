<script setup>
import { onMounted, ref } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { api, getErrorMessage } from '../api';

const perfil = ref(null);
const errorMessage = ref('');
const selectedImagemUrl = ref('');
const cropperImage = ref(null);
const isSending = ref(false);
let cropper = null;

async function getPerfil() {
  try {
    const { data } = await api.get('/usuarios/me');
    perfil.value = data;
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  }
}

function openCropper(event) {
  const [imagem] = event.target.files;
  event.target.value = '';
  if (!imagem) {
    return;
  }
  closeCropper();
  selectedImagemUrl.value = URL.createObjectURL(imagem);
}

function startCropper() {
  cropper = new Cropper(cropperImage.value, { aspectRatio: 1, viewMode: 1 });
}

function closeCropper() {
  cropper?.destroy();
  cropper = null;
  URL.revokeObjectURL(selectedImagemUrl.value);
  selectedImagemUrl.value = '';
}

async function sendImagemPerfil() {}

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
          <label class="button-secondary upload-button">
            Trocar foto
            <input type="file" accept="image/*" hidden @change="openCropper" />
          </label>
        </div>
      </div>
      <p v-if="perfil.endereco" class="muted">
        {{ perfil.endereco.cidade }} - {{ perfil.endereco.estado }}
      </p>
      <div v-if="selectedImagemUrl" class="crop-editor">
        <div class="crop-area">
          <img
            ref="cropperImage"
            :src="selectedImagemUrl"
            alt="Imagem para recortar"
            @load="startCropper"
          />
        </div>
        <div class="actions">
          <button class="button-secondary" @click="closeCropper">Cancelar</button>
          <button :disabled="isSending" @click="sendImagemPerfil">
            Salvar foto
          </button>
        </div>
      </div>
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

.upload-button {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.crop-editor {
  margin-top: 24px;
}

.crop-area {
  max-height: 400px;
}

.crop-area img {
  display: block;
  max-width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
</style>
