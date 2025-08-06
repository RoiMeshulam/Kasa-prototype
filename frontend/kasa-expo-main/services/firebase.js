// services/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcDvHCI9fnMkdPPA_eFErKN2feVA5kiyc",
  authDomain: "kasa-prototype.firebaseapp.com",
  databaseURL: "https://kasa-prototype-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kasa-prototype",
  storageBucket: "kasa-prototype.appspot.com",
  messagingSenderId: "218299349057",
  appId: "1:218299349057:web:6c44adfa55aebf73622ec0",
  measurementId: "G-60FGX9FGNQ"
};

const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb };
