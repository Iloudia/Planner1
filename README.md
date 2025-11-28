# Planner Home (React + TSX)

Page d'accueil du planner avec 12 cartes, un carrousel de tâches à gauche, et à droite un panneau profil + progression (année/mois/journée) + bloc-notes persisté en localStorage. L'UI tourne en React/TSX via Vite.

## Prérequis
- Node.js 18+ (et npm).

## Installation
```bash
npm install
```

## Lancer en développement
```bash
npm run dev
```
Vite ouvre l'app (par défaut sur http://localhost:5173). Ajoute `-- --host` si tu veux tester depuis un mobile sur le réseau local.

## Build et prévisualisation
```bash
npm run build
npm run preview
```

## Où modifier le contenu
- UI principale : `src/App.tsx`
- Styles globaux : `src/styles.css`
- Images : `src/assets/`
- Données des tâches : tableau `taskData` dans `src/App.tsx`
- Bloc-notes : persistance localStorage sous la clé `planner-notes`
