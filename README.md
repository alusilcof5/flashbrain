# 🧠 FlashBrain

Convierte apuntes en flashcards al instante usando la API de Anthropic.
Diseñado para estudiantes de ESO (12-14 años).

## Estructura del proyecto

```
flashbrain/
├── index.html          # Estructura HTML
├── css/
│   └── styles.css      # Estilos (tema espacial oscuro)
├── js/
│   ├── agent.js        # Lógica del agente: prompt, API, parser, validación
│   ├── ui.js           # Manipulación del DOM
│   └── main.js         # Orquestador: conecta agente + UI + estado
├── .env.example        # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

## Cómo usarlo

1. Clona o descarga el proyecto.
2. Copia `.env.example` a `.env.local` y añade tu API key.
3. Abre `index.html` directamente en el navegador
   (usa un servidor local como `npx serve .` para evitar restricciones CORS).
4. Introduce tu API key de Anthropic en la interfaz, pega tus apuntes y pulsa **Crear mis flashcards**.

## Consigue tu API Key

Regístrate gratis en [console.anthropic.com](https://console.anthropic.com).

## Notas técnicas

- **Sin dependencias**: HTML + CSS + JS puro con ES Modules. Sin frameworks.
- **SOLID**: cada fichero tiene una única responsabilidad.
- **DRY**: sin lógica duplicada entre agent, ui y main.
- La API key se guarda en `localStorage` del navegador, nunca en el servidor.
# flashbrain
