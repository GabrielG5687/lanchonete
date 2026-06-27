import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (!getApps().length) {
  initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID })
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não informado.' })
  }

  try {
    const decoded = await getAuth().verifyIdToken(token)
    req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name || decoded.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}
