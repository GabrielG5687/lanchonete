import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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

export default createRouter({
  history: createWebHistory(),
  routes,
})
