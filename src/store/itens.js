import { ref } from 'vue'

export const itens = ref([
  {
    id: 1,
    nome: 'X-Salada UNEMAT',
    descricao: 'Pao, hamburguer artesanal, queijo, alface e tomate.',
    preco: 16.5,
    categoria: 'Lanche',
    disponivel: true,
  },
  {
    id: 2,
    nome: 'Suco de Laranja 500ml',
    descricao: 'Suco natural sem adicao de acucar.',
    preco: 8,
    categoria: 'Bebida',
    disponivel: true,
  },
  {
    id: 3,
    nome: 'Brownie com Sorvete',
    descricao: 'Brownie caseiro com cobertura de chocolate.',
    preco: 12,
    categoria: 'Sobremesa',
    disponivel: false,
  },
])

function proximoId() {
  // Gera IDs locais incrementais para manter o CRUD sem backend.
  if (!itens.value.length) return 1
  return Math.max(...itens.value.map((item) => item.id)) + 1
}

export function salvar(item) {
  // Normaliza os dados para evitar inconsistencias entre cadastro/edicao.
  const payload = {
    ...item,
    nome: String(item.nome || '').trim(),
    descricao: String(item.descricao || '').trim(),
    preco: Number(item.preco),
    disponivel: Boolean(item.disponivel),
  }

  const index = itens.value.findIndex((atual) => atual.id === payload.id)

  if (index >= 0) {
    itens.value[index] = payload
    return payload
  }

  const novoItem = { ...payload, id: proximoId() }
  itens.value.push(novoItem)
  return novoItem
}

export function excluir(id) {
  itens.value = itens.value.filter((item) => item.id !== Number(id))
}

export function buscarPorId(id) {
  return itens.value.find((item) => item.id === Number(id))
}
