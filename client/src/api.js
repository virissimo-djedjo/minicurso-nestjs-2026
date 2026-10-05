import axios from 'axios';
import { router } from './router';
import { accessToken, clearAccessToken } from './session';

export const api = axios.create();

api.interceptors.request.use((config) => {
  if (accessToken.value) {
    config.headers.Authorization = `Bearer ${accessToken.value}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && accessToken.value) {
      clearAccessToken();
      router.push('/login');
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  const message = error.response?.data?.message;
  if (Array.isArray(message)) {
    return message.join(' ');
  }
  return message ?? 'Não foi possível falar com o servidor. Tente de novo em instantes.';
}
