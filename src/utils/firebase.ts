import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwpIugx9UYl8EZFSQz2kBUEqdAqkc-xAg",
  authDomain: "meandrituals-72041.firebaseapp.com",
  projectId: "meandrituals-72041",
  storageBucket: "meandrituals-72041.firebasestorage.app",
  messagingSenderId: "1086898403259",
  appId: "1:1086898403259:web:55bad861fddbd7f229f69e",
  measurementId: "G-J9KPY6T85X",
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

let analytics: Analytics | null = null;
const analyticsReady = isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
    return analytics;
  })
  .catch(() => null);

export { app, auth, db, storage, analytics, analyticsReady };
