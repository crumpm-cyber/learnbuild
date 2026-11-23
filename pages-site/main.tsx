import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Game } from "../src/game/Game";
import "../src/styles.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Game />
    </StrictMode>,
  );
}
