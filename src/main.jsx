// main.jsx
// Application entry point
// Sets up React with StrictMode, Router, and Auth Provider
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

// Get root element and render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter enables client-side routing */}
    <BrowserRouter>
      {/* AuthProvider makes authentication state available throughout the app */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
