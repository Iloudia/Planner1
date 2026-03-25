# Planner Home (React + TSX)

Page d'accueil du planner avec 12 cartes, un carrousel de tâches à gauche, et à droite un panneau profil + progression (année/mois/journée) + bloc-notes persisté en localStorage. L'UI tourne en React/TSX via Vite.

## Données utilisateur
- `/calendrier` : données personnalisées par utilisateur via Firestore dans `users/{uid}/calendarEvents`
- `/journaling` : entrées personnalisées par utilisateur via Firestore dans `users/{uid}/journalEntries`
- `/archives` : la section journaling lit désormais Firestore ; la section self-love reste sur le stockage local actuel
- `/finances` : mouvements et snapshots mensuels personnalisés par utilisateur via Firestore dans `users/{uid}/financeEntries` et `users/{uid}/financeMonthlySnapshots`
- Aucun import automatique des anciennes données `localStorage` n'est effectué pour ces modules
- Règles Firestore versionnées dans `firestore.rules`

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

Dans un second terminal :
```bash
npm run dev:server
```

En local, Vite proxifie `/api` et `/media` vers le serveur Node (`127.0.0.1:4242` par défaut). `VITE_API_BASE` reste optionnel pour viser une autre cible.

## Build et prévisualisation
```bash
npm run build
npm run preview
```

## Production
- Front statique servi par Nginx ou Firebase Hosting
- API Node derrière Nginx sur `/api`
- Médias servis sur `/media`
- Référence de déploiement : `deploy/DEPLOY_VPS.md`

## Firebase Hosting
Le repo contient maintenant `firebase.json` et `.firebaserc` pour déployer le build Vite sur Firebase Hosting.

Flux recommandé :
```bash
npm run build
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

Pour la prod publique, construis le front avec :
```bash
VITE_API_BASE=https://api.meandrituals.com npm run build
```

La config Hosting est prévue pour une SPA React :
- `dist/` comme répertoire publié
- rewrite global vers `index.html`
- cache long sur les assets buildés
- `index.html` et `version.json` en `no-cache`

## Où modifier le contenu
- UI principale : `src/App.tsx`
- Styles globaux : `src/styles.css`
- Images : `src/assets/`
- Données des tâches : tableau `taskData` dans `src/App.tsx`
- Bloc-notes : persistance localStorage sous la clé `planner-notes`
