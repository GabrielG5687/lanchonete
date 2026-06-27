// Define as rotas REST de itens.
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { create, getAll, getById, getPublicos, remove, update } from '../controllers/itensController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const itensRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

// Rota pública — sem auth, retorna todos os itens disponíveis
router.get('/publicos', itensRateLimiter, getPublicos)

// Rotas privadas — exigem token válido, filtradas pelo usuário logado
router.get('/', itensRateLimiter, requireAuth, getAll)
router.get('/:id', itensRateLimiter, requireAuth, getById)
router.post('/', itensRateLimiter, requireAuth, create)
router.put('/:id', itensRateLimiter, requireAuth, update)
router.delete('/:id', itensRateLimiter, requireAuth, remove)

export default router
