import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import App from "./App.jsx";

import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";

import "./index.css";

// ============================================================
// APPLICATION
// ============================================================

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <BrowserRouter>
                <AuthProvider>
                    <LanguageProvider>
                        <App />
                    </LanguageProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);