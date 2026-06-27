// Define as rotas REST de itens.
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { create, getAll, getById, remove, update } from '../controllers/itensController.js'

const router = Router()
const itensRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/', itensRateLimiter, getAll)
router.get('/:id', itensRateLimiter, getById)
router.post('/', itensRateLimiter, create)
router.put('/:id', itensRateLimiter, update)
router.delete('/:id', itensRateLimiter, remove)

export default router
