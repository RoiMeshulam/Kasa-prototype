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

// Production Firebase Config
const productionConfig = {
  apiKey: "AIzaSyAcDvHCI9fnMkdPPA_eFErKN2feVA5kiyc",
  authDomain: "kasa-prototype.firebaseapp.com",
  databaseURL: "https://kasa-prototype-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kasa-prototype",
  storageBucket: "kasa-prototype.appspot.com",
  messagingSenderId: "218299349057",
  appId: "1:218299349057:web:6c44adfa55aebf73622ec0",
  measurementId: "G-60FGX9FGNQ"
};

// Test Firebase Config - You need to replace these with actual test project credentials
const testConfig = {
  apiKey: "AIzaSyBfGPnN_Q_5RJByE4HlAjWgJbGClY1yGTY",
  authDomain: "kasa-test.firebaseapp.com",
  databaseURL: "https://kasa-test-fe398-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kasa-test-fe398",
  storageBucket: "kasa-test-fe398.firebasestorage.app",
  messagingSenderId: "756418549644",
  appId: "1:756418549644:android:28a7db345c89b393e728a9",
};

// Determine which config to use based on environment
const getFirebaseConfig = () => {
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'production';
  console.log('🔧 Firebase Environment:', environment);
  
  switch (environment) {
    case 'development':
      console.log('📱 Using TEST Firebase configuration for development');
      return testConfig;
    case 'test':
      console.log('📱 Using TEST Firebase configuration');
      return testConfig;
    case 'production':
    default:
      console.log('📱 Using PRODUCTION Firebase configuration');
      return productionConfig;
  }
};

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app);

console.log('🔥 Firebase initialized with project:', firebaseConfig.projectId);

export { auth, db, realtimeDb };
