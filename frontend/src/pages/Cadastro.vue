<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemForm from '../components/ItemForm.vue'
import { buscarPorId, salvar } from '../store/itens'

const route = useRoute()
const router = useRouter()

const salvando = ref(false)
const snackbar = ref({
  aberto: false,
  texto: '',
  cor: 'success',
})

const itemAtual = computed(() => {
  if (!route.params.id) return undefined
  return buscarPorId(route.params.id)
})

const itemNaoEncontrado = computed(() => !!route.params.id && !itemAtual.value)

function mostrarSnackbar(texto, cor = 'success') {
  snackbar.value = {
    aberto: true,
    texto,
    cor,
  }
}

async function onSalvar(payload) {
  salvando.value = true

  try {
    await salvar(payload)
    mostrarSnackbar('Item salvo com sucesso.', 'success')
    await new Promise((resolve) => setTimeout(resolve, 700))
    router.push({
      path: '/lista',
      query: { sucesso: 'Cadastro atualizado com sucesso.' },
    })
  } catch (error) {
    mostrarSnackbar('Nao foi possivel salvar o item. Tente novamente.', 'error')
  } finally {
    salvando.value = false
  }
}

function onCancelar() {
  router.push('/lista')
}
</script>

<template>
  <v-container fluid class="pa-0">
    <v-alert
      v-if="itemNaoEncontrado"
      type="warning"
      variant="tonal"
      class="mb-4"
      title="Item nao encontrado"
      text="O item informado nao existe mais. Verifique sua lista de cardapio."
    />

    <v-btn
      v-if="itemNaoEncontrado"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="router.push('/lista')"
    >
      Voltar para lista
    </v-btn>

    <ItemForm
      v-else
      :item="itemAtual"
      :loading="salvando"
      @salvar="onSalvar"
      @cancelar="onCancelar"
    />

    <v-snackbar v-model="snackbar.aberto" :color="snackbar.cor" timeout="2500" location="top right">
      {{ snackbar.texto }}
    </v-snackbar>
  </v-container>
</template>
