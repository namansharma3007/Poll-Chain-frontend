import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BlockchainProvider } from "./context/BlockchainContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BlockchainProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BlockchainProvider>
    </AuthProvider>
  </StrictMode>
);
