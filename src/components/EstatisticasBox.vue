<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  ativos: {
    type: Number,
    default: 0,
  },
})

const inativos = computed(() => Math.max(props.total - props.ativos, 0))

const cards = computed(() => [
  {
    titulo: 'Total de itens',
    valor: props.total,
    icone: 'mdi-format-list-bulleted-square',
    cor: 'primary',
  },
  {
    titulo: 'Disponiveis',
    valor: props.ativos,
    icone: 'mdi-check-circle-outline',
    cor: 'success',
  },
  {
    titulo: 'Indisponiveis',
    valor: inativos.value,
    icone: 'mdi-alert-circle-outline',
    cor: 'secondary',
  },
])
</script>

<template>
  <v-row class="mt-1" dense>
    <v-col v-for="card in cards" :key="card.titulo" cols="12" sm="4">
      <v-card class="pa-4 h-100">
        <div class="d-flex align-center justify-space-between">
          <div>
            <p class="text-medium-emphasis mb-1">{{ card.titulo }}</p>
            <p class="text-h5 font-weight-bold mb-0">{{ card.valor }}</p>
          </div>
          <v-avatar :color="card.cor" size="42" variant="tonal">
            <v-icon :icon="card.icone" />
          </v-avatar>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
