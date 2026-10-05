import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const API_URL = 'http://localhost:3030';
const API_PATHS = ['/usuarios', '/auth', '/enderecos', '/publicacoes', '/uploads'];

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: Object.fromEntries(API_PATHS.map((path) => [path, API_URL])),
  },
});
