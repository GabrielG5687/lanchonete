// Implementa as regras de negócio e operações CRUD de itens.
import { pool } from '../db/client.js'

const categoriasValidas = ['Lanche', 'Bebida', 'Sobremesa']

const COLS_PUBLICOS = 'id, nome, descricao, preco, categoria, disponivel, criado_por, created_at, updated_at'
const COLS_PRIVADOS = 'id, nome, descricao, preco, categoria, disponivel, criado_por, user_uid, created_at, updated_at'

function parseDisponivel(value) {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

// Público: todos os itens, sem filtro de usuário
export async function getPublicos(req, res) {
  try {
    const { categoria, disponivel } = req.query
    const conditions = []
    const values = []

    if (categoria) {
      values.push(categoria)
      conditions.push(`categoria = $${values.length}`)
    }

    const disponivelParsed = parseDisponivel(disponivel)
    if (disponivel !== undefined && disponivelParsed === null) {
      return res.status(400).json({ error: 'Parâmetro "disponivel" deve ser true ou false.' })
    }
    if (disponivelParsed !== undefined) {
      values.push(disponivelParsed)
      conditions.push(`disponivel = $${values.length}`)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await pool.query(
      `SELECT ${COLS_PUBLICOS} FROM itens ${whereClause} ORDER BY id ASC`,
      values,
    )

    return res.json(result.rows)
  } catch {
    return res.status(500).json({ error: 'Erro ao listar itens.' })
  }
}

// Privado: apenas itens do usuário logado
export async function getAll(req, res) {
  try {
    const { categoria, disponivel } = req.query
    const conditions = ['user_uid = $1']
    const values = [req.user.uid]

    if (categoria) {
      values.push(categoria)
      conditions.push(`categoria = $${values.length}`)
    }

    const disponivelParsed = parseDisponivel(disponivel)
    if (disponivel !== undefined && disponivelParsed === null) {
      return res.status(400).json({ error: 'Parâmetro "disponivel" deve ser true ou false.' })
    }
    if (disponivelParsed !== undefined) {
      values.push(disponivelParsed)
      conditions.push(`disponivel = $${values.length}`)
    }

    const result = await pool.query(
      `SELECT ${COLS_PRIVADOS} FROM itens WHERE ${conditions.join(' AND ')} ORDER BY id ASC`,
      values,
    )

    return res.json(result.rows)
  } catch {
    return res.status(500).json({ error: 'Erro ao listar itens.' })
  }
}

export async function getById(req, res) {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT ${COLS_PRIVADOS} FROM itens WHERE id = $1 AND user_uid = $2`,
      [id, req.user.uid],
    )

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Item não encontrado.' })
    }

    return res.json(result.rows[0])
  } catch {
    return res.status(500).json({ error: 'Erro ao buscar item.' })
  }
}

export async function create(req, res) {
  try {
    const { nome, descricao = null, preco, categoria, disponivel = true } = req.body

    if (!nome || preco === undefined || !categoria) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, preco e categoria.' })
    }

    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({ error: 'Categoria inválida.' })
    }

    const disponivelParsed = parseDisponivel(disponivel)
    if (disponivelParsed === null) {
      return res.status(400).json({ error: 'Campo "disponivel" deve ser true ou false.' })
    }

    const result = await pool.query(
      `INSERT INTO itens (nome, descricao, preco, categoria, disponivel, criado_por, user_uid)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLS_PRIVADOS}`,
      [nome, descricao, preco, categoria, disponivelParsed, req.user.name, req.user.uid],
    )

    return res.status(201).json(result.rows[0])
  } catch {
    return res.status(500).json({ error: 'Erro ao criar item.' })
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params
    const fields = ['nome', 'descricao', 'preco', 'categoria', 'disponivel']
    const updates = []
    const values = []

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (field === 'categoria' && !categoriasValidas.includes(req.body[field])) {
          return res.status(400).json({ error: 'Categoria inválida.' })
        }

        if (field === 'disponivel') {
          const disponivelParsed = parseDisponivel(req.body[field])
          if (disponivelParsed === null) {
            return res.status(400).json({ error: 'Campo "disponivel" deve ser true ou false.' })
          }
          values.push(disponivelParsed)
        } else {
          values.push(req.body[field])
        }

        updates.push(`${field} = $${values.length}`)
      }
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualização.' })
    }

    values.push(id)
    values.push(req.user.uid)
    const result = await pool.query(
      `UPDATE itens SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${values.length - 1} AND user_uid = $${values.length}
       RETURNING ${COLS_PRIVADOS}`,
      values,
    )

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Item não encontrado.' })
    }

    return res.json(result.rows[0])
  } catch {
    return res.status(500).json({ error: 'Erro ao atualizar item.' })
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM itens WHERE id = $1 AND user_uid = $2 RETURNING id',
      [id, req.user.uid],
    )

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Item não encontrado.' })
    }

    return res.status(204).send()
  } catch {
    return res.status(500).json({ error: 'Erro ao remover item.' })
  }
}
