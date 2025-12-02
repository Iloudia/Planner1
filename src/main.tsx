import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TasksProvider } from "./context/TasksContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Élément racine introuvable");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <CookieConsentProvider>
            <App />
          </CookieConsentProvider>
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
