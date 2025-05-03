import "./index.css";
import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { ThemeProvider } from "@/components/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
