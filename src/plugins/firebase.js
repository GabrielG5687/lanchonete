import { initializeApp } from 'firebase/app'

// Cole aqui as credenciais do Firebase Console:
// Projeto → Configuracoes → Seus apps → Web
const firebaseConfig = {
  apiKey: 'AIzaSyCU34K4YSQYGqewpznrmUcoDH8rhpWa-VQ',
  authDomain: 'fmds2026-1-92e7b.firebaseapp.com',
  projectId: 'fmds2026-1-92e7b',
  storageBucket: 'fmds2026-1-92e7b.firebasestorage.app',
  messagingSenderId: '256266040510',
  appId: '1:256266040510:web:697ec7ec6544ec25069aef',
}

export const firebaseConfigured =
  Boolean(firebaseConfig.apiKey?.startsWith('AIzaSy')) &&
  Boolean(firebaseConfig.authDomain?.includes('.firebaseapp.com')) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.appId?.includes(':web:'))

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null

export default app
