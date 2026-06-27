<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { carregarPublicos, itens, itensError, itensLoading } from '../store/itens'

const router = useRouter()
const itemSelecionado = ref(null)
const dialog = ref(false)

const iconeCategoria = {
  Lanche: 'mdi-hamburger',
  Bebida: 'mdi-cup-outline',
  Sobremesa: 'mdi-ice-cream',
}

const corCategoria = {
  Lanche: 'orange-darken-2',
  Bebida: 'blue-darken-1',
  Sobremesa: 'pink-darken-1',
}

function abrirModal(item) {
  itemSelecionado.value = item
  dialog.value = true
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(carregarPublicos)
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero -->
    <v-card class="pa-6 mb-6 hero-card">
      <p class="text-overline text-secondary mb-1">Lanchonete UNEMAT</p>
      <h1 class="text-h4 text-md-h3 mb-2">Nosso Cardapio</h1>
      <p class="text-medium-emphasis mb-0">
        Confira os itens disponíveis. Clique em um produto para ver mais detalhes.
      </p>
    </v-card>

    <!-- Loading -->
    <div v-if="itensLoading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Erro -->
    <v-alert v-else-if="itensError" type="error" variant="tonal" class="mb-4">
      Nao foi possivel carregar o cardapio. Tente novamente mais tarde.
    </v-alert>

    <!-- Vazio -->
    <v-alert
      v-else-if="!itens.length"
      type="info"
      variant="tonal"
      icon="mdi-tray-alert"
      class="mb-4"
    >
      Nenhum item cadastrado no cardapio ainda.
    </v-alert>

    <!-- Cards -->
    <v-row v-else>
      <v-col
        v-for="item in itens"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          rounded="lg"
          elevation="2"
          class="h-100 produto-card"
          :class="{ 'indisponivel': !item.disponivel }"
          @click="abrirModal(item)"
        >
          <div class="categoria-banner d-flex align-center justify-center pa-4">
            <v-icon :icon="iconeCategoria[item.categoria] || 'mdi-food'" size="48" color="white" />
          </div>

          <v-card-title class="text-body-1 font-weight-bold pt-3">
            {{ item.nome }}
          </v-card-title>

          <v-card-subtitle class="d-flex align-center ga-1 pb-3">
            <v-icon size="14" icon="mdi-account-outline" />
            {{ item.criado_por || 'Lanchonete UNEMAT' }}
          </v-card-subtitle>

          <v-card-actions class="pt-0 px-4 pb-3 justify-space-between">
            <v-chip :color="corCategoria[item.categoria]" size="small" label>
              {{ item.categoria }}
            </v-chip>
            <v-chip :color="item.disponivel ? 'success' : 'secondary'" size="small">
              {{ item.disponivel ? 'Disponivel' : 'Indisponivel' }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de detalhes -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card v-if="itemSelecionado" rounded="lg">
        <div :class="`categoria-banner-modal d-flex align-center justify-center pa-6 bg-${corCategoria[itemSelecionado.categoria]}`">
          <v-icon
            :icon="iconeCategoria[itemSelecionado.categoria] || 'mdi-food'"
            size="56"
            color="white"
          />
        </div>

        <v-card-title class="text-h6 pt-4 px-5">{{ itemSelecionado.nome }}</v-card-title>

        <v-card-text class="px-5 pb-2">
          <p class="text-body-2 text-medium-emphasis mb-4">{{ itemSelecionado.descricao }}</p>

          <v-list density="compact" class="pa-0">
            <v-list-item prepend-icon="mdi-cash" :subtitle="formatarPreco(itemSelecionado.preco)" title="Preco" />
            <v-list-item prepend-icon="mdi-shape-outline" :subtitle="itemSelecionado.categoria" title="Categoria" />
            <v-list-item
              prepend-icon="mdi-check-circle-outline"
              :subtitle="itemSelecionado.disponivel ? 'Disponivel' : 'Indisponivel'"
              title="Situacao"
            />
            <v-list-item
              prepend-icon="mdi-account-outline"
              :subtitle="itemSelecionado.criado_por || 'Lanchonete UNEMAT'"
              title="Cadastrado por"
            />
          </v-list>
        </v-card-text>

        <v-card-actions class="px-5 pb-4 justify-end">
          <v-btn variant="tonal" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.1), rgba(255, 160, 0, 0.15));
}

.produto-card {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.produto-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
}

.indisponivel {
  opacity: 0.6;
}

.categoria-banner {
  background: linear-gradient(135deg, #d32f2f, #ff6f00);
  min-height: 100px;
}
</style>
