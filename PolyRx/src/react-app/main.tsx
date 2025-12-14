import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/react-app/App";
import "@/react-app/index.css";
import { LanguageProvider } from "@/react-app/contexts/LanguageContext";
import { ThemeProvider } from "@/react-app/contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
