// Executa as migrações iniciais necessárias para o backend.
import { pool } from './client.js'

const createItensTableSql = `
CREATE TABLE IF NOT EXISTS itens (
  id          SERIAL PRIMARY KEY,
  nome        TEXT    NOT NULL,
  descricao   TEXT,
  preco       NUMERIC(10,2) NOT NULL,
  categoria   TEXT    NOT NULL CHECK (categoria IN ('Lanche','Bebida','Sobremesa')),
  disponivel  BOOLEAN NOT NULL DEFAULT TRUE,
  criado_por  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
`

const addCriadoPorColumnSql = `
ALTER TABLE itens ADD COLUMN IF NOT EXISTS criado_por TEXT;
`

const addUserUidColumnSql = `
ALTER TABLE itens ADD COLUMN IF NOT EXISTS user_uid TEXT;
`

export async function runMigrations() {
  await pool.query(createItensTableSql)
  await pool.query(addCriadoPorColumnSql)
  await pool.query(addUserUidColumnSql)
}
