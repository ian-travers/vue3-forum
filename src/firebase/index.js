import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import firebaseConfig from '@/config/firebase'

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
