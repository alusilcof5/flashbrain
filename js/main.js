// ─── main.js ─────────────────────────────────────────────────────────
// Orchestrator: wires up agent, UI and state. No business logic here.

import { generateFlashcards } from "./agent.js";
import {
  dom,
  showError, hideError,
  showLoading, hideLoading, setLoadingMessage,
  setGenerating,
  renderCards, flipAllCards, resetUI,
} from "./ui.js";

// ─── Config ───────────────────────────────────────────────────────────
const STORAGE_KEY = "flashbrain_apikey";

const LOADING_MESSAGES = [
  "Leyendo tus apuntes... 📚",
  "Pensando buenas preguntas... 🤔",
  "Generando tus flashcards... ✨",
  "¡Casi listo! 🚀",
];

// ─── State ────────────────────────────────────────────────────────────
const state = {
  subject:    "",
  cards:      [],
  allFlipped: false,
};

// ─── Storage ──────────────────────────────────────────────────────────
const saveKey  = key => localStorage.setItem(STORAGE_KEY, key);
const loadKey  = ()  => localStorage.getItem(STORAGE_KEY) ?? "";

// ─── Subject selector ─────────────────────────────────────────────────
dom.subjectRow().addEventListener("click", e => {
  const btn = e.target.closest(".subject-btn");
  if (!btn) return;
  document.querySelectorAll(".subject-btn")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  state.subject = btn.dataset.subject;
});

// ─── Generate ─────────────────────────────────────────────────────────
dom.generateBtn().addEventListener("click", async () => {
  hideError();

  const apiKey = dom.apiKey().value.trim();
  const notes  = dom.notesInput().value.trim();

  if (!apiKey) return showError("Introduce tu API Key de Anthropic primero.");
  if (!notes)  return showError("Escribe o pega tus apuntes antes de continuar.");
  if (notes.length < 30) return showError("Los apuntes son demasiado cortos. Añade más texto.");

  saveKey(apiKey);
  setGenerating(true);
  showLoading();
  dom.results().style.display = "none";

  let msgIdx = 0;
  setLoadingMessage(LOADING_MESSAGES[0]);
  const msgTimer = setInterval(
    () => setLoadingMessage(LOADING_MESSAGES[++msgIdx % LOADING_MESSAGES.length]),
    1800
  );

  try {
    state.cards      = await generateFlashcards(notes, state.subject, apiKey);
    state.allFlipped = false;
    renderCards(state.cards);
    dom.results().scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showError(err.message);
  } finally {
    clearInterval(msgTimer);
    hideLoading();
    setGenerating(false);
  }
});

// ─── Flip all ─────────────────────────────────────────────────────────
dom.flipAllBtn().addEventListener("click", () => {
  state.allFlipped = !state.allFlipped;
  flipAllCards(state.allFlipped);
});

// ─── Shuffle ──────────────────────────────────────────────────────────
dom.shuffleBtn().addEventListener("click", () => {
  const shuffled = [...state.cards].sort(() => Math.random() - .5);
  renderCards(shuffled);
});

// ─── Reset ────────────────────────────────────────────────────────────
dom.resetBtn().addEventListener("click", () => {
  state.cards = [];
  resetUI();
});

// ─── Init ─────────────────────────────────────────────────────────────
dom.apiKey().value = loadKey();
