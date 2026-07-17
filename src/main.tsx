import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import { migrateInitialWebsiteData, migrateV2 } from "./services/migration.service";

Promise.all([migrateInitialWebsiteData(), migrateV2()]).finally(() => createRoot(document.getElementById("root")!).render(
  <React.StrictMode><AuthProvider><App /></AuthProvider></React.StrictMode>,
));
