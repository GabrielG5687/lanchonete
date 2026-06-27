import { ref } from 'vue'
import { itensApi } from '../services/api.js'

export const itens = ref([])
export const itensLoading = ref(false)
export const itensError = ref('')

// Carrega apenas os itens do usuário logado (telas de admin)
export async function carregarItens() {
  itensLoading.value = true
  itensError.value = ''
  try {
    itens.value = await itensApi.listar()
  } catch (error) {
    itensError.value = error.message
  } finally {
    itensLoading.value = false
  }
}

// Carrega todos os itens sem autenticação (cardápio público)
export async function carregarPublicos() {
  itensLoading.value = true
  itensError.value = ''
  try {
    itens.value = await itensApi.listarPublicos()
  } catch (error) {
    itensError.value = error.message
  } finally {
    itensLoading.value = false
  }
}

export async function salvar(item) {
  const payload = {
    nome: String(item.nome || '').trim(),
    descricao: String(item.descricao || '').trim(),
    preco: Number(item.preco),
    categoria: item.categoria,
    disponivel: Boolean(item.disponivel),
  }

  if (item.id) {
    const atualizado = await itensApi.atualizar(item.id, payload)
    const index = itens.value.findIndex((i) => i.id === item.id)
    if (index >= 0) itens.value[index] = atualizado
    return atualizado
  }

  const novoItem = await itensApi.criar(payload)
  itens.value.push(novoItem)
  return novoItem
}

export async function excluir(id) {
  await itensApi.excluir(id)
  itens.value = itens.value.filter((item) => item.id !== Number(id))
}

export function buscarPorId(id) {
  return itens.value.find((item) => item.id === Number(id))
}
