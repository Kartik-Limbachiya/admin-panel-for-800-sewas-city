import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBxOKe44xBylnwuQhULbGZIxah6MkDnWrM",
  authDomain: "sewas-city-e0c35.firebaseapp.com",
  projectId: "sewas-city-e0c35",
  storageBucket: "sewas-city-e0c35.firebasestorage.app",
  messagingSenderId: "18048398924",
  appId: "1:18048398924:web:af79e4f4593a8f511e26e9",
  measurementId: "G-BX0BMRXBS4",
}

export const isFirebaseConfigured = true

let app: any = null
let auth: any = null
let db: any = null

try {
  console.log("[v0] Initializing Firebase with config:", { projectId: firebaseConfig.projectId })
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)
  console.log("[v0] Firebase initialized successfully")
} catch (error) {
  console.error("[v0] Firebase initialization failed:", error)
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase initialization failed")),
    signOut: () => Promise.reject(new Error("Firebase initialization failed")),
  }

  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.reject(new Error("Firebase initialization failed")),
        set: () => Promise.reject(new Error("Firebase initialization failed")),
      }),
    }),
  }
}

export { auth, db }
