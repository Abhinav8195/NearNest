import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCnIE3dIdRh5irJ84gNLJsWQ0i7pFA8kz0",
  authDomain: "nearnest-f1575.firebaseapp.com",
  projectId: "nearnest-f1575",
  storageBucket: "nearnest-f1575.firebasestorage.app",
  messagingSenderId: "49364743801",
  appId: "1:49364743801:web:4df699e4450a6c6f9806a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });;
  export const db= getFirestore(app)