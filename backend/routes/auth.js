// Define as rotas de status de autenticação.
import { Router } from 'express'
import { status } from '../controllers/authController.js'

const router = Router()

router.get('/status', status)

export default router
