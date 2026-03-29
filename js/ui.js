// ─── ui.js ───────────────────────────────────────────────────────────
// Responsible for: all DOM manipulation and card rendering.
// Zero business logic here.

/**
 * @typedef {{ q: string, a: string }} Flashcard
 */

// ─── DOM refs ────────────────────────────────────────────────────────
export const dom = {
  apiKey:      () => document.getElementById("apiKey"),
  notesInput:  () => document.getElementById("notesInput"),
  generateBtn: () => document.getElementById("generateBtn"),
  errorBox:    () => document.getElementById("errorBox"),
  loading:     () => document.getElementById("loading"),
  loadingText: () => document.getElementById("loadingText"),
  results:     () => document.getElementById("results"),
  cardsGrid:   () => document.getElementById("cardsGrid"),
  progressText:() => document.getElementById("progressText"),
  flipAllBtn:  () => document.getElementById("flipAllBtn"),
  shuffleBtn:  () => document.getElementById("shuffleBtn"),
  resetBtn:    () => document.getElementById("resetBtn"),
  subjectRow:  () => document.getElementById("subjectRow"),
};

// ─── Error ───────────────────────────────────────────────────────────
export const showError = msg => {
  const box = dom.errorBox();
  box.textContent = "⚠️ " + msg;
  box.classList.add("visible");
};

export const hideError = () =>
  dom.errorBox().classList.remove("visible");

// ─── Loading ─────────────────────────────────────────────────────────
export const showLoading = () =>
  dom.loading().classList.add("visible");

export const hideLoading = () =>
  dom.loading().classList.remove("visible");

export const setLoadingMessage = msg =>
  (dom.loadingText().textContent = msg);

// ─── Generate button ─────────────────────────────────────────────────
export const setGenerating = on => {
  const btn = dom.generateBtn();
  btn.disabled = on;
  btn.textContent = on ? "⏳ Generando..." : "✨ Crear mis flashcards";
};

// ─── Card builder ─────────────────────────────────────────────────────
const buildCardEl = (card, index) => {
  const el = document.createElement("div");
  el.className = "flashcard";
  el.style.animationDelay = `${index * 0.07}s`;
  el.innerHTML = `
    <div class="flashcard-inner">
      <div class="card-face card-front">
        <div class="card-header">
          <span class="card-label">Pregunta</span>
          <span class="card-num">${index + 1}</span>
        </div>
        <div class="card-text">${card.q}</div>
        <div class="card-hint">Toca para ver la respuesta 👆</div>
      </div>
      <div class="card-face card-back">
        <div class="card-header">
          <span class="card-label">Respuesta</span>
          <span class="card-num">${index + 1}</span>
        </div>
        <div class="card-text">${card.a}</div>
        <div class="card-hint">Toca para volver 🔄</div>
      </div>
    </div>`;
  el.addEventListener("click", () => el.classList.toggle("flipped"));
  return el;
};

// ─── Render cards ─────────────────────────────────────────────────────
export const renderCards = cards => {
  const grid = dom.cardsGrid();
  grid.innerHTML = "";
  cards.forEach((card, i) => grid.appendChild(buildCardEl(card, i)));
  dom.progressText().textContent = `${cards.length} flashcards`;
  dom.results().style.display = "block";
};

// ─── Flip all ─────────────────────────────────────────────────────────
export const flipAllCards = flipped => {
  document.querySelectorAll(".flashcard")
    .forEach(c => c.classList.toggle("flipped", flipped));
  dom.flipAllBtn().textContent = flipped
    ? "🙈 Ocultar respuestas"
    : "🔄 Ver todas las respuestas";
};

// ─── Reset ────────────────────────────────────────────────────────────
export const resetUI = () => {
  dom.notesInput().value = "";
  dom.results().style.display = "none";
  dom.notesInput().focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
