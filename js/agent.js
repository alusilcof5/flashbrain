// ─── agent.js ────────────────────────────────────────────────────────
// Responsible for: system prompt, API call, parsing, validation.
// Zero UI logic here.

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL   = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `Eres un generador de flashcards de estudio para estudiantes de ESO (12-14 años).

Tu ÚNICA tarea: leer el texto del usuario y convertirlo en flashcards de pregunta y respuesta.
Usa lenguaje claro, cercano y fácil de entender para un adolescente.

FORMATO OBLIGATORIO — responde SIEMPRE así, sin excepción ni texto extra:
FLASHCARD 1
P: [pregunta clara]
R: [respuesta corta, máximo 2 frases]
---
FLASHCARD 2
P: [pregunta]
R: [respuesta]
---

REGLAS:
- Genera entre 4 y 8 flashcards
- Preguntas que comprendan conceptos, no que copien el texto
- Sin texto fuera del formato
- Si hay asignatura específica, adapta el lenguaje a ella`;

/**
 * @typedef {{ q: string, a: string }} Flashcard
 */

/**
 * Calls the Anthropic API and returns the raw text response.
 * @param {string} notes
 * @param {string} subject
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
const callAPI = async (notes, subject, apiKey) => {
  const userContent = subject
    ? `Asignatura: ${subject}\n\nApuntes:\n${notes}`
    : notes;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
};

/**
 * Validates that the raw response contains at least one flashcard.
 * @param {string} raw
 * @returns {boolean}
 */
const isValidResponse = raw =>
  /P:\s*.+/.test(raw) && /R:\s*.+/.test(raw);

/**
 * Parses raw text into an array of Flashcard objects.
 * @param {string} raw
 * @returns {Flashcard[]}
 */
const parseFlashcards = raw =>
  raw
    .split("---")
    .map(block => ({
      q: block.match(/P:\s*(.+)/)?.[1]?.trim() ?? "",
      a: block.match(/R:\s*(.+)/)?.[1]?.trim() ?? "",
    }))
    .filter(({ q, a }) => q && a);

/**
 * Main agent entry point.
 * Calls the API, validates, parses and returns flashcards.
 * @param {string} notes
 * @param {string} subject
 * @param {string} apiKey
 * @returns {Promise<Flashcard[]>}
 */
export const generateFlashcards = async (notes, subject, apiKey) => {
  const raw = await callAPI(notes, subject, apiKey);

  if (!isValidResponse(raw)) {
    throw new Error("La respuesta no tiene el formato esperado. Inténtalo de nuevo.");
  }

  const cards = parseFlashcards(raw);
  if (cards.length === 0) {
    throw new Error("No se pudieron generar flashcards. Prueba con un texto más largo.");
  }

  return cards;
};
