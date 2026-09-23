import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, setAnalyticsCollectionEnabled, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

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
const db: Firestore = getFirestore(app);

let analytics: Analytics | null = null;
let analyticsReady: Promise<Analytics | null> | null = null;
let analyticsConsentGranted = false;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

const applyBrowserAnalyticsConsent = (enabled: boolean) => {
  if (typeof window === "undefined") {
    return;
  }
  const analyticsWindow = window as AnalyticsWindow;
  Reflect.set(analyticsWindow, `ga-disable-${firebaseConfig.measurementId}`, !enabled);
  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: enabled ? "granted" : "denied",
  });
};

applyBrowserAnalyticsConsent(false);

const initAnalytics = () => {
  if (!analyticsReady) {
    analyticsReady = isSupported()
      .then((supported) => {
        if (!supported) {
          return null;
        }
        if (!analytics) {
          analytics = getAnalytics(app);
        }
        setAnalyticsCollectionEnabled(analytics, analyticsConsentGranted);
        return analytics;
      })
      .catch(() => null);
  }

  return analyticsReady;
};

const setAnalyticsConsent = (enabled: boolean) => {
  analyticsConsentGranted = enabled;
  applyBrowserAnalyticsConsent(enabled);

  if (enabled) {
    return initAnalytics().then((instance) => {
      if (instance) {
        setAnalyticsCollectionEnabled(instance, true);
      }
      return instance;
    });
  }

  if (analytics) {
    setAnalyticsCollectionEnabled(analytics, false);
  }
  if (analyticsReady) {
    void analyticsReady.then((instance) => {
      if (instance && !analyticsConsentGranted) {
        setAnalyticsCollectionEnabled(instance, false);
      }
    });
  }
  return Promise.resolve(analytics);
};

export { app, auth, db, analytics, analyticsReady, initAnalytics, setAnalyticsConsent };
