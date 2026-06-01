<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const drawer = ref(true)

const menu = [
  { titulo: 'Home', rota: '/', icone: 'mdi-home-outline' },
  { titulo: 'Cardapio', rota: '/lista', icone: 'mdi-format-list-bulleted' },
  { titulo: 'Novo Item', rota: '/cadastro', icone: 'mdi-plus-box-outline' },
  { titulo: 'Sobre', rota: '/sobre', icone: 'mdi-information-outline' },
]
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable" elevation="2">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-icon icon="mdi-storefront-outline" class="mr-2" />
      <v-toolbar-title class="font-weight-bold">Lanchonete UNEMAT</v-toolbar-title>
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
  </v-app>
</template>
