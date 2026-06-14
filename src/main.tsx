import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Hotjar from '@hotjar/browser';
import "./index.css";
import App from "./App.tsx";

const siteId = 871068; 
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
