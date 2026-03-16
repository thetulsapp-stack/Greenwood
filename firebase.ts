import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * ✅ Use env vars in production.
 * For now you can hardcode to get unblocked quickly.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBhBxdl1leJjKbV6KMkeiceQaFOSaOmsbg", 
  authDomain: "thetulsaapp-73edc.firebaseapp.com",
  projectId: "thetulsaapp-73edc",
  storageBucket: "thetulsaapp-73edc.firebasestorage.app",
  messagingSenderId: "917566046361",
  appId: "1:917566046361:web:4ab13b828f20561e9d7808"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
