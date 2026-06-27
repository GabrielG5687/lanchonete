<script setup>
import { useRouter } from 'vue-router'
import { loginWithGoogle, authLoading, authError, firebaseConfigured, isLoggedIn } from '../store/auth'

const router = useRouter()

async function entrar() {
  await loginWithGoogle()
  if (isLoggedIn.value) {
    router.push('/')
  }
}
</script>

<template>
  <div class="login-page d-flex align-center justify-center">
    <v-card class="login-card pa-8 text-center" max-width="420" width="100%" elevation="8">
      <v-icon icon="mdi-storefront-outline" size="56" color="primary" class="mb-4" />
      <p class="text-overline text-secondary mb-1">Lanchonete UNEMAT</p>
      <h1 class="text-h5 font-weight-bold mb-2">Bem-vindo</h1>
      <p class="text-medium-emphasis mb-8">
        Use sua conta Google para acessar o sistema.
      </p>

      <v-alert
        v-if="!firebaseConfigured"
        type="warning"
        variant="tonal"
        class="mb-4 text-left"
        title="Firebase nao configurado"
        text="Abra src/plugins/firebase.js e cole as credenciais do Firebase Console."
      />

      <v-btn
        color="primary"
        size="large"
        block
        :loading="authLoading"
        :disabled="!firebaseConfigured"
        prepend-icon="mdi-google"
        @click="entrar"
      >
        Entrar com Google
      </v-btn>

      <v-alert v-if="authError" type="error" variant="tonal" class="mt-4 text-left">
        {{ authError }}
      </v-alert>
    </v-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.08), rgba(255, 160, 0, 0.12));
}

.login-card {
  border-radius: 16px;
}
</style>
