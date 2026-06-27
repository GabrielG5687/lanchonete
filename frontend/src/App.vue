<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { user, logout } from './store/auth'

const route = useRoute()
const router = useRouter()
const drawer = ref(true)

const isLoginPage = computed(() => route.path === '/login')
const isCardapioPublico = computed(() => route.path === '/cardapio')

const menu = [
  { titulo: 'Home', rota: '/', icone: 'mdi-home-outline' },
  { titulo: 'Cardapio', rota: '/lista', icone: 'mdi-format-list-bulleted' },
  { titulo: 'Novo Item', rota: '/cadastro', icone: 'mdi-plus-box-outline' },
  { titulo: 'Sobre', rota: '/sobre', icone: 'mdi-information-outline' },
]

async function sair() {
  await logout()
  router.push('/cardapio')
}
</script>

<template>
  <v-app>
    <!-- Página de login: sem layout -->
    <template v-if="isLoginPage">
      <router-view />
    </template>

    <!-- Cardápio público: header simples, sem sidebar -->
    <template v-else-if="isCardapioPublico">
      <v-app-bar color="primary" density="comfortable" elevation="2">
        <v-icon icon="mdi-storefront-outline" class="ml-3 mr-2" />
        <v-toolbar-title class="font-weight-bold">Lanchonete UNEMAT</v-toolbar-title>
        <v-spacer />
        <v-btn
          variant="outlined"
          color="white"
          class="mr-3"
          prepend-icon="mdi-login"
          @click="router.push('/login')"
        >
          Entrar
        </v-btn>
      </v-app-bar>

      <v-main>
        <v-container class="py-6">
          <router-view />
        </v-container>
      </v-main>
    </template>

    <!-- Layout completo para usuários logados -->
    <template v-else>
      <v-app-bar color="primary" density="comfortable" elevation="2">
        <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
        <v-icon icon="mdi-storefront-outline" class="mr-2" />
        <v-toolbar-title class="font-weight-bold">Lanchonete UNEMAT</v-toolbar-title>
        <v-spacer />

        <div v-if="user" class="d-flex align-center ga-2 mr-2">
          <v-avatar v-if="user.photoURL" size="32">
            <v-img :src="user.photoURL" :alt="user.displayName" />
          </v-avatar>
          <span class="text-body-2 d-none d-sm-inline">{{ user.displayName }}</span>
          <v-btn icon="mdi-logout" variant="text" size="small" title="Sair" @click="sair" />
        </div>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        color="surface"
        border="end"
        :rail="$vuetify.display.smAndDown"
        :permanent="$vuetify.display.mdAndUp"
        :temporary="$vuetify.display.smAndDown"
      >
        <v-list nav density="comfortable" class="pt-4">
          <v-list-item
            v-for="item in menu"
            :key="item.rota"
            :active="route.path === item.rota || (item.rota === '/cadastro' && route.path.startsWith('/cadastro'))"
            :prepend-icon="item.icone"
            :title="item.titulo"
            rounded="lg"
            class="mb-1"
            @click="router.push(item.rota)"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container class="py-6">
          <router-view />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>
