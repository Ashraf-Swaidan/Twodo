import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProjectsProvider } from "./hooks/useProjects.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <AuthProvider>
     <ProjectsProvider>
      <App />
     </ProjectsProvider>
    </AuthProvider>
  </NextUIProvider>
);
