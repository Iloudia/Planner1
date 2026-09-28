import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwpIugx9UYl8EZFSQz2kBUEqdAqkc-xAg",
  authDomain: "meandrituals-72041.firebaseapp.com",
  projectId: "meandrituals-72041",
  messagingSenderId: "1086898403259",
  appId: "1:1086898403259:web:55bad861fddbd7f229f69e",
  measurementId: "G-J9KPY6T85X",
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { app, auth, firebaseConfig };
