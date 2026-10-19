import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TasksProvider } from "./context/TasksContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import { MoodboardProvider } from "./context/MoodboardContext";
import { BlogPublishingProvider } from "./context/BlogPublishingContext";
import MobileRuntimeBridge from "./platform/MobileRuntimeBridge";
import { initializeAppRuntime } from "./platform/runtime";
import { LanguageProvider } from "./context/LanguageContext";
import "./i18n";
import "./styles.css";
import "./dark-mode.css";

const rootElement = document.getElementById("root");

initializeAppRuntime();

if (!rootElement) {
  throw new Error("Élément racine introuvable");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MobileRuntimeBridge />
      <AuthProvider>
        <LanguageProvider>
          <TasksProvider>
            <CookieConsentProvider>
              <MoodboardProvider>
                <BlogPublishingProvider>
                  <App />
                </BlogPublishingProvider>
              </MoodboardProvider>
            </CookieConsentProvider>
          </TasksProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
