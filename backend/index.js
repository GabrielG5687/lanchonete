// Inicializa o servidor, aplica middlewares, rotas e documentação.
import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { apiReference } from '@scalar/express-api-reference'
import { runMigrations } from './db/migrations.js'
import { swaggerSpec } from './docs/swagger.js'
import authRouter from './routes/auth.js'
import itensRouter from './routes/itens.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api/itens', itensRouter)
app.use('/api/auth', authRouter)
app.use('/docs', apiReference({ spec: { content: swaggerSpec } }))

async function startServer() {
  try {
    await runMigrations()
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta ${PORT}`)
    })
  } catch (error) {
    console.error('Falha ao iniciar backend:', error)
    process.exit(1)
  }
}

startServer()
