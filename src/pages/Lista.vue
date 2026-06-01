<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { excluir, itens } from '../store/itens'

const route = useRoute()
const router = useRouter()

const carregando = ref(true)
const busca = ref('')
const filtroCategoria = ref(null)
const dialogExcluir = ref(false)
const itemSelecionado = ref(null)

const snackbar = ref({
  aberto: false,
  texto: '',
  cor: 'success',
})

const headers = [
  { title: 'Nome', key: 'nome' },
  { title: 'Categoria', key: 'categoria' },
  { title: 'Preco', key: 'preco', align: 'end' },
  { title: 'Disponibilidade', key: 'disponivel', align: 'center' },
  { title: 'Acoes', key: 'acoes', sortable: false, align: 'center' },
]

const categorias = ['Lanche', 'Bebida', 'Sobremesa']

const itensFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()

  // Busca textual + filtro por categoria no mesmo fluxo.
  return itens.value.filter((item) => {
    const correspondeBusca =
      !termo ||
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo)

    const correspondeCategoria = !filtroCategoria.value || item.categoria === filtroCategoria.value

    return correspondeBusca && correspondeCategoria
  })
})

const vazioSemCadastro = computed(() => itens.value.length === 0)

function mostrarSnackbar(texto, cor = 'success') {
  snackbar.value = {
    aberto: true,
    texto,
    cor,
  }
}

function abrirDialog(item) {
  itemSelecionado.value = item
  dialogExcluir.value = true
}

function confirmarExclusao() {
  if (!itemSelecionado.value) return

  excluir(itemSelecionado.value.id)
  mostrarSnackbar('Item removido com sucesso.', 'success')
  dialogExcluir.value = false
  itemSelecionado.value = null
}

function irParaEdicao(item) {
  router.push(`/cadastro/${item.id}`)
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  carregando.value = false

  if (route.query.sucesso) {
    mostrarSnackbar(String(route.query.sucesso), 'success')
    router.replace({ path: '/lista' })
  }
})
</script>

<template>
  <v-container fluid class="pa-0">
    <v-card class="pa-6 mb-4">
      <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-4">
        <div>
          <h1 class="text-h5 mb-1">Cardapio da Lanchonete</h1>
          <p class="text-medium-emphasis mb-0">Gerencie os itens e acompanhe disponibilidade.</p>
        </div>

        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/cadastro')">
          Novo Item
        </v-btn>
      </div>

      <v-row dense class="mb-2">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="busca"
            label="Buscar por nome ou descricao"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filtroCategoria"
            label="Filtrar por categoria"
            :items="categorias"
            clearable
            hide-details
          />
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="itensFiltrados"
        :loading="carregando"
        loading-text="Carregando itens..."
        no-data-text="Nenhum item encontrado para os filtros informados."
        class="elevation-0"
      >
        <template #item.preco="{ item }">
          <span class="font-weight-medium">{{ formatarPreco(item.preco) }}</span>
        </template>

        <template #item.disponivel="{ item }">
          <v-chip :color="item.disponivel ? 'success' : 'secondary'" size="small">
            {{ item.disponivel ? 'Disponivel' : 'Indisponivel' }}
          </v-chip>
        </template>

        <template #item.acoes="{ item }">
          <div class="d-flex justify-center gap-2">
            <v-btn icon="mdi-pencil-outline" size="small" color="primary" variant="text" @click="irParaEdicao(item)" />
            <v-btn icon="mdi-delete-outline" size="small" color="error" variant="text" @click="abrirDialog(item)" />
          </div>
        </template>
      </v-data-table>

      <v-alert
        v-if="vazioSemCadastro"
        type="info"
        variant="tonal"
        class="mt-4"
        icon="mdi-tray-alert"
      >
        Nenhum item cadastrado ainda. Clique em <strong>Novo Item</strong> para iniciar o cardapio.
      </v-alert>
    </v-card>

    <v-dialog v-model="dialogExcluir" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Confirmar exclusao</v-card-title>
        <v-card-text>
          Deseja realmente excluir o item
          <strong>{{ itemSelecionado?.nome }}</strong
          >?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialogExcluir = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmarExclusao">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.aberto" :color="snackbar.cor" timeout="2500" location="top right">
      {{ snackbar.texto }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
