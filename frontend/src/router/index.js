import { createRouter, createWebHistory } from 'vue-router'
import { authReady, isLoggedIn } from '../store/auth'

const routes = [
  {
    path: '/cardapio',
    name: 'cardapio',
    component: () => import('../pages/Cardapio.vue'),
    meta: { public: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/lista',
    name: 'lista',
    component: () => import('../pages/Lista.vue'),
  },
  {
    path: '/cadastro/:id?',
    name: 'cadastro',
    component: () => import('../pages/Cadastro.vue'),
  },
  {
    path: '/sobre',
    name: 'sobre',
    component: () => import('../pages/Sobre.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  await authReady

  if (to.path === '/login' && isLoggedIn.value) {
    return '/'
  }

  if (!to.meta.public && !isLoggedIn.value) {
    return '/cardapio'
  }
})

export default router
