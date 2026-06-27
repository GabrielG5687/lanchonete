import { ref, computed } from 'vue'
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth'
import { firebaseConfigured } from '../plugins/firebase.js'

export { firebaseConfigured }

export const user = ref(null)
export const authLoading = ref(false)
export const authError = ref('')

export const isLoggedIn = computed(() => user.value !== null)

let auth = null
let provider = null

function getFirebaseAuth() {
  if (!firebaseConfigured) return null

  if (!auth) {
    auth = getAuth()
    provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
  }

  return { auth, provider }
}

export const authReady = new Promise((resolve) => {
  const firebaseAuth = getFirebaseAuth()

  if (!firebaseAuth) {
    resolve()
    return
  }

  let ready = false
  onAuthStateChanged(firebaseAuth.auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      }
    } else {
      user.value = null
    }

    if (!ready) {
      ready = true
      resolve()
    }
  })
})

export async function loginWithGoogle() {
  const firebaseAuth = getFirebaseAuth()

  if (!firebaseAuth) {
    authError.value =
      'Configure o Firebase em src/plugins/firebase.js (Firebase Console → Seus apps → Web).'
    return
  }

  authLoading.value = true
  authError.value = ''

  try {
    const result = await signInWithPopup(firebaseAuth.auth, firebaseAuth.provider)
    user.value = {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    }
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      authError.value = 'Nao foi possivel entrar com o Google. Tente novamente.'
    }
  } finally {
    authLoading.value = false
  }
}

export async function logout() {
  const firebaseAuth = getFirebaseAuth()
  if (firebaseAuth) {
    await signOut(firebaseAuth.auth)
  }
  user.value = null
}
