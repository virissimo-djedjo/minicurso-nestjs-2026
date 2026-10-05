import { computed, ref } from 'vue';

const ACCESS_TOKEN_KEY = 'accessToken';

export const accessToken = ref(localStorage.getItem(ACCESS_TOKEN_KEY));

export const isLoggedIn = computed(() => !!accessToken.value);

export const usuarioId = computed(() =>
  accessToken.value ? JSON.parse(atob(accessToken.value.split('.')[1])).sub : null,
);

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  accessToken.value = token;
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  accessToken.value = null;
}
