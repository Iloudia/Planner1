# Compatibilité mobile Capacitor

## Architecture

- Le site React/Vite et ses scripts historiques sont conservés.
- `capacitor.config.ts` pointe vers le build Vite existant dans `dist/`.
- `.env.mobile` surcharge uniquement l'URL publique de l'API pendant `vite build --mode mobile`.
- `src/platform/` centralise la détection Capacitor, le bouton retour Android, les liens entrants et l'ouverture des URLs externes.
- Les styles natifs sont activés uniquement par la classe `html.is-capacitor`.

## Vérifications effectuées

- Navigation : `BrowserRouter` est conservé ; les routes internes restent gérées par React Router.
- Retour Android : historique React quand une page précédente existe, fermeture de l'app à la racine.
- Safe areas : viewport `viewport-fit=cover` et marges système iPhone/Android limitées au runtime Capacitor.
- Clavier : le viewport demande `interactive-widget=resizes-content` et les champs iOS natifs évitent le zoom automatique.
- Scroll : inertie tactile et blocage du rebond global uniquement dans l'app native ; les zones de scroll internes restent intactes.
- Formulaires et uploads : les champs HTML et `FormData` restent utilisés ; le sélecteur système ne demande pas de permission de stockage générale.
- Téléchargements et liens externes : ouverture avec le navigateur natif Capacitor.
- Stockage : `localStorage`, `sessionStorage` et la persistance Firebase restent isolés dans la WebView de l'app.
- API : le build mobile utilise une URL HTTPS absolue et ne modifie pas les URLs de la version web.
- CORS : le serveur accepte une liste mobile séparée via `MOBILE_CORS_ORIGINS`.
- Paiement : Stripe s'ouvre dans le navigateur natif ; les URLs de retour restent des URLs web HTTPS valides.
- Deep links : l'abstraction sait router les URLs `meandrituals://` et les liens `https://meandrituals.com`, mais l'association de domaine reste à activer dans les comptes Apple/Google si elle devient nécessaire.

## Configuration manuelle avant publication

1. Ajouter `MOBILE_CORS_ORIGINS=capacitor://localhost,https://localhost` à l'environnement du serveur API, en conservant `CORS_ORIGINS` pour le web.
2. Confirmer que `com.meandrituals.app` est l'identifiant définitif avant de créer les fiches sur les stores.
3. Remplacer les icônes et écrans de lancement Capacitor générés par les visuels officiels.
4. Configurer les certificats/profils Apple et la clé de signature Android.
5. Pour Google Sign-In natif, ajouter un plugin Firebase Authentication, puis les fichiers fournis par Firebase pour chaque plateforme.
6. Pour les Universal Links/App Links, publier les fichiers d'association de domaine et activer les capacités natives correspondantes.

## Permissions

La version actuelle n'appelle directement ni caméra, ni microphone, ni géolocalisation. Aucune permission sensible supplémentaire n'a donc été ajoutée. Android conserve uniquement la permission réseau générée par Capacitor.
