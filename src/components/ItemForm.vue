<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['salvar', 'cancelar'])

const formRef = ref(null)
const form = ref({
  id: undefined,
  nome: '',
  descricao: '',
  categoria: null,
  preco: null,
  disponivel: true,
})

const categorias = ['Lanche', 'Bebida', 'Sobremesa']

const rules = {
  required: (value) => !!value || 'Este campo e obrigatorio.',
  minNome: (value) =>
    String(value || '').trim().length >= 3 || 'Digite ao menos 3 caracteres.',
  preco: (value) => {
    if (value === null || value === undefined || value === '') return 'Informe um preco.'
    if (Number(value) <= 0) return 'O preco deve ser maior que zero.'
    return true
  },
}

const titulo = computed(() => (props.item?.id ? 'Editar item' : 'Novo item'))
const subtitulo = computed(() =>
  props.item?.id
    ? 'Atualize as informacoes do item selecionado.'
    : 'Preencha os campos para cadastrar um novo item no cardapio.',
)

function aplicarItemNoFormulario(item) {
  form.value = {
    id: item?.id,
    nome: item?.nome || '',
    descricao: item?.descricao || '',
    categoria: item?.categoria || null,
    preco: item?.preco ?? null,
    disponivel: item?.disponivel ?? true,
  }
}

watch(
  () => props.item,
  (novoItem) => aplicarItemNoFormulario(novoItem),
  { immediate: true },
)

async function onSalvar() {
  const validacao = await formRef.value?.validate()
  if (!validacao?.valid) return
  emit('salvar', { ...form.value, preco: Number(form.value.preco) })
}
</script>

<template>
  <v-card class="pa-6">
    <div class="mb-6">
      <h2 class="text-h5 mb-1">{{ titulo }}</h2>
      <p class="text-medium-emphasis mb-0">{{ subtitulo }}</p>
    </div>

    <v-form ref="formRef" @submit.prevent="onSalvar">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.nome"
            label="Nome"
            :rules="[rules.required, rules.minNome]"
            prepend-inner-icon="mdi-food"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.categoria"
            label="Categoria"
            :items="categorias"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-shape-outline"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="form.descricao"
            label="Descricao"
            rows="3"
            auto-grow
            :rules="[rules.required]"
            prepend-inner-icon="mdi-text-box-outline"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="form.preco"
            label="Preco"
            type="number"
            prefix="R$"
            min="0"
            step="0.01"
            :rules="[rules.preco]"
            prepend-inner-icon="mdi-cash"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-switch
            v-model="form.disponivel"
            color="success"
            label="Disponivel para venda"
            inset
          />
        </v-col>
      </v-row>

      <div class="d-flex gap-3 mt-4">
        <v-btn color="primary" type="submit" :loading="loading">Salvar</v-btn>
        <v-btn variant="outlined" :disabled="loading" @click="emit('cancelar')">
          Cancelar
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
