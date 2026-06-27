<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EstatisticasBox from '../components/EstatisticasBox.vue'
import { itens } from '../store/itens'

const router = useRouter()

const totalItens = computed(() => itens.value.length)
const itensDisponiveis = computed(() => itens.value.filter((item) => item.disponivel).length)
</script>

<template>
  <v-container fluid class="pa-0">
    <v-card class="pa-6 mb-6 hero-card">
      <p class="text-overline text-secondary mb-1">Lanchonete UNEMAT</p>
      <h1 class="text-h4 text-md-h3 mb-2">Gestao de Cardapio</h1>
      <p class="text-medium-emphasis mb-6">
        Organize os itens da lanchonete universitaria com rapidez, clareza e foco na experiencia
        do usuario.
      </p>

      <div class="d-flex flex-wrap gap-3">
        <v-btn color="primary" size="large" prepend-icon="mdi-format-list-bulleted" @click="router.push('/lista')">
          Ver Cardapio
        </v-btn>
        <v-btn color="secondary" size="large" prepend-icon="mdi-plus" @click="router.push('/cadastro')">
          Novo Item
        </v-btn>
      </div>
    </v-card>

    <EstatisticasBox :total="totalItens" :ativos="itensDisponiveis" />
  </v-container>
</template>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.1), rgba(255, 160, 0, 0.15));
}

.gap-3 {
  gap: 12px;
}
</style>
