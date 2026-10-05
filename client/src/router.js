import { createRouter, createWebHashHistory } from 'vue-router';
import { isLoggedIn } from './session';
import LoginView from './views/LoginView.vue';
import CadastroView from './views/CadastroView.vue';
import PerfilView from './views/PerfilView.vue';
import FeedView from './views/FeedView.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/feed' },
    { path: '/login', component: LoginView, meta: { isPublic: true } },
    { path: '/cadastro', component: CadastroView, meta: { isPublic: true } },
    { path: '/perfil', component: PerfilView },
    { path: '/feed', component: FeedView },
  ],
});

router.beforeEach((to) => {
  if (!to.meta.isPublic && !isLoggedIn.value) {
    return '/login';
  }
  return true;
});
