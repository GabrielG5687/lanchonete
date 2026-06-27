import { getAuth } from 'firebase/auth'

const BASE_URL = import.meta.env.VITE_API_URL

async function getAuthHeader() {
  const token = await getAuth().currentUser?.getIdToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}, withAuth = true) {
  const authHeader = withAuth ? await getAuthHeader() : {}
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}))
    throw new Error(erro.error || erro.message || `Erro ${response.status}`)
  }

  if (response.status === 204) return null

  return response.json()
}

export const itensApi = {
  // Público: todos os itens (para o cardápio)
  listarPublicos: () => request('/api/itens/publicos', {}, false),

  // Privados: apenas itens do usuário logado
  listar: () => request('/api/itens'),
  buscarPorId: (id) => request(`/api/itens/${id}`),
  criar: (dados) => request('/api/itens', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => request(`/api/itens/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  excluir: (id) => request(`/api/itens/${id}`, { method: 'DELETE' }),
}
