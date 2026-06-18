# Nyctoflora — Interactive Luminescent Biosphere 🌿🔮

An immersive, high-performance interactive web ecosystem built with pure HTML5, advanced CSS3, and heavy Vanilla JavaScript (ES6+). The project explores the concept of a mystical night forest using a strict dark/purple/neon-green color palette.

[Live Demo Link](https://qsefxr.github.io/BioSynth/)

## 🌟 Key Features

*   **Dynamic State-Driven Ecosystem:** The entire website behavior is controlled by a central JS State Management system. User interactions (e.g., triggering "photosynthesis" or "night rain") alter the global state, dynamically adapting UI variables.
*   **Interactive Canvas Particle System:** Custom JS-driven background rendering ambient bio-luminescent spores that interact with mouse movement (repulsion/attraction algorithms).
*   **Data-Driven Content Engine:** All flora and fauna components are rendered dynamically from structured JS object arrays, supporting custom filtering and real-time DOM manipulation.
*   **Advanced UI/UX & Responsiveness:** Fluid responsive typography using CSS `clamp()`, flexible CSS Grid layouts, custom animated cursor, and heavy utilization of `Intersection Observer API` for performant scroll-animations.

## 🛠️ Tech Stack & Architecture

*   **Markup:** Semantic HTML5
*   **Styling:** CSS3 (BEM methodology, Custom Properties/Variables, Backdrop Filters, Grid/Flexbox)
*   **Scripting:** Vanilla JavaScript (ES6+ Modules, Object-Oriented Architecture / Functional Components)
*   **Performance Optimization:** Event throttling/debouncing for mouse movements and resizing, Canvas API for efficient particle rendering.

## 📁 Project Structure

```text
├── index.html          # Application entry point
├── css/
│   ├── main.css        # Core styles & layout
│   └── variables.css   # Color palette & theme configuration
├── js/
│   ├── app.js          # App initialization
│   ├── state.js        # Global state management (Ecosystem Engine)
│   ├── particles.js    # Canvas/DOM particle physics
│   └── domRenderer.js  # Dynamic UI component rendering
└── assets/             # Custom fonts, SVG icons, and media
