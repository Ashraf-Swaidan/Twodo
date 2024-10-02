import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import { ProjectsProvider } from "./hooks/useProjects.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <ProjectsProvider>
      <App />
    </ProjectsProvider>
  </NextUIProvider>
);
