# Audit et harmonisation visuelle — 15 septembre 2026

## Résultat

Harmonisation volontairement limitée à la cohérence typographique et aux détails
éditoriaux. La composition, les images, les couleurs, les animations, les
breakpoints et la logique fonctionnelle restent en place.

- 99 déclarations CSS de moins au total dans les fichiers modifiés, après ajout
  des tokens et du focus clavier.
- Aucun nouveau `!important` ; deux déclarations `!important` supprimées.
- Trois familles téléchargées sans usage retirées : Space Grotesk, Manrope, Allura.
- Trois imports de polices invalides, placés après des règles CSS et déjà ignorés,
  supprimés dans Home, Journaling et Diet.
- Aucun changement des règles de headers, de leurs composants ou de la navigation.
- Aucun changement visuel mesuré sur les références `/blog` et `/blog/mode`.

## 1. Système existant

Le projet utilise React et Vite, avec 43 feuilles CSS sous `src`. Il n'utilise
pas Tailwind. La base du système est déjà présente dans `src/styles.css` :
familles, tailles, interlignages, couleurs et échelle d'espacement dans `:root`.

`index.html` charge les principales webfonts. De nombreuses feuilles de pages
importent en plus Playfair Display et Libre Baskerville. Le thème utilise des
variables globales et des variantes locales ; le réglage de taille utilisateur
est porté par `--user-font-scale` dans `SettingsDisplay.tsx`.

Les composants partagés comprennent notamment Header, PageHeading,
AdministrativePageHeader, PageTemplate et EditorialQuote. Les headers ainsi
que les citations décoratives ont été conservés. Aucun composant supplémentaire
ni nouvelle bibliothèque de design n'a été introduit.

### Cause principale des contradictions

Le bloc « Typography system » de `src/styles.css` applique plusieurs règles
globales `!important`. Elles écrasent des tailles et familles définies dans les
pages, même lorsque les sélecteurs locaux sont plus précis.

Par exemple, un `h3` de carte peut déclarer `1rem` localement mais être rendu
à `1.25rem`, soit 20 px. Plusieurs paragraphes déclarent Libre Baskerville alors
que la règle globale leur impose Inter. Ces déclarations locales masquées
entretiennent une fausse description du design réellement affiché.

Le nettoyage a supprimé les propriétés sans effet dans les blocs de contenu
vérifiés, en laissant la règle globale fournir la valeur. Les exceptions locales
actives et les règles des headers n'ont pas été supprimées automatiquement.

## 2. Références : Blog et Mode

`/blog/mode` réutilise `BlogCategoryTemplate` et les styles de `BlogPage.css`.
Il existe donc déjà un modèle éditorial commun, et non deux designs séparés.

Valeurs calculées à l'échelle utilisateur par défaut :

| Rôle | Police | Taille / interligne | Graisse |
| --- | --- | --- | --- |
| Titre du header Blog / Mode, observé uniquement | Playfair Display | 32 px / 35,84 px | 600 |
| Titres secondaires | Playfair Display | 24 px / 30 px | 600 |
| Titres des cartes d'articles | Playfair Display | 20 px / 25 px | 500 |
| Paragraphes | Inter | 16 px / 27,2 px | 400 |
| Métadonnées et dates | Inter | 12 px | Selon leur rôle |
| Liens « Lire l'article » | Inter | 12 px | 600 |
| Actions éditoriales `.blog-button` | Inter | 10,56 px / 12,672 px | 600 |

Les actions éditoriales sont en majuscules avec un espacement de `0.24em`.
Les liens textuels utilisent `0.16em`. Les boutons de formulaire ordinaires
restent un rôle distinct, basé sur le token existant de 14 px.

Autres caractéristiques à conserver :

- Fond clair, surfaces blanches, textes noirs et accents chocolat.
- Cartes rectangulaires et bordures fines ; effets de survol discrets.
- Padding de contenu des cartes : `clamp(1rem, 2vw, 1.35rem)`.
- Espacement titre/texte modéré et paragraphes respirants.
- Largeurs de lecture contenues, grilles et rythmes verticaux adaptés au contexte.

Les espacements des grands blocs n'ont pas été uniformisés : une grille
d'articles et un agenda n'ont pas les mêmes contraintes de densité.

## 3. Inventaire typographique

L'inventaire distingue les noms déclarés, les polices chargées et les familles
qui gagnent effectivement dans la cascade CSS. Une déclaration locale n'est
pas une preuve que cette police s'affiche.

| Famille | Constat | Décision |
| --- | --- | --- |
| Playfair Display | Base des titres, utilisée par les références | Conservée |
| Inter | Base des paragraphes, formulaires et actions | Conservée et réutilisée pour les labels/liens identifiés |
| Kapakana | Marque, headers et citations manuscrites | Conservée, choix graphique volontaire |
| Italiana | Headers ; certaines anciennes déclarations de cartes étaient masquées | Headers conservés ; déclarations masquées retirées dans les cartes concernées |
| Libre Baskerville | Textes locaux, détails de lettres, compteurs et modales ; nombreuses déclarations masquées | Conservée pour les usages décoratifs ; listes et aides Mindset harmonisées avec Inter |
| Space Grotesk | Chargée dans `index.html`, aucune utilisation trouvée dans `src` | Chargement supprimé |
| Manrope | Chargée dans `index.html`, aucune utilisation trouvée dans `src` | Chargement supprimé |
| Allura | Chargée par Routine, aucune déclaration d'usage trouvée | Retirée de l'import |
| Montserrat | Une déclaration dans un sous-titre de recette, masquée par la typographie globale des listes | Déclaration supprimée |
| Arial, Times New Roman, Georgia, polices système | Fallbacks et quelques usages décoratifs ou symboles | Conservés ; ce ne sont pas des téléchargements supplémentaires |

La cible est un duo principal Playfair Display / Inter avec des exceptions
décoratives identifiées, pas une seule police appliquée partout.

## 4. Modifications réalisées

### Base commune

Quelques détails éditoriaux ont été nommés dans `:root`, en reprenant les valeurs
existantes du blog : graisse des titres de cartes, graisse des actions,
interligne des contrôles, espacement des lettres et padding des cartes.

Les tailles de titres, textes et légendes utilisent les tokens déjà présents.
Aucune valeur existante de header n'a été modifiée.

### Self Love

- Titres des cartes en graisse 500, comme les cartes du blog, au lieu de 400.
- Padding des cartes relié au même token que le blog, sans changement de valeur.
- Suppression des familles, tailles et interlignes locaux déjà écrasés.
- Labels « Découvrir » basés sur le token de légende de 12 px.
- Typographie du lien « Voir le blog » alignée sur le rôle d'action éditoriale ;
  ses couleurs, son padding et son effet de survol restent propres à la page.

### Mindset

- Les aides des blocs qualités/pensées passent de Libre Baskerville 11,52 px à
  Inter 14 px, avec le token de texte secondaire.
- Les textes des listes qualités/pensées utilisent Inter, la taille de corps
  de texte et l'interligne commun. Leur taille suit `--user-font-scale`.
- Les lettres, compteurs décoratifs et citations gardent leurs choix graphiques.

### Workout

- Les boutons d'ajout partagent la graisse d'action 600.
- Ajout d'un contour de focus clavier chocolat, sans changer le survol.
- Les labels et liens des recommandations utilisaient la serif héritée du
  conteneur de page : les cartes utilisent maintenant Inter pour ces éléments,
  tandis que leurs titres restent en Playfair Display.
- Labels de plateforme et métadonnées à 12 px ; lien « Voir le profil » basé
  sur le token de bouton de 14 px.
- Deux règles de plateforme qui répétaient exactement les couleurs du style
  de base ont été supprimées. Les formes, icônes et couleurs sont conservées.

### Nettoyage sans changement de rendu

Les propriétés masquées ont été retirées dans des blocs vérifiés de Blog,
Sport, Workout, Self Love, Mindset, Routine, Diet, Menu, Wishlist, À propos,
FAQ, Contact, Boutique et Panier.

Les règles d'en-tête de section ont également été protégées, en plus du header
principal et des grands headers de pages. Aucun breakpoint n'a été ajouté.

## 5. Vérifications

- Comparaison avant/après des styles calculés sur 18 pages, en 390, 768 et
  1440 px de largeur : 54 configurations.
- Headers identiques dans ces 54 configurations : famille, taille, graisse,
  interligne, espacement des lettres, couleur, fond, marges, padding, dimensions
  et transformation de texte comparés sur les headers et leurs descendants.
- Les références Blog/Mode et les cinq pages publiques supplémentaires sont
  identiques sur les éléments typographiques mesurés.
- Aucun débordement horizontal détecté dans les pages contrôlées.
- Vérification complémentaire de Home et Journaling aux trois largeurs après
  retrait de leurs imports invalides : six configurations supplémentaires.
- Essai mobile en texte XL (`--user-font-scale: 1.18`) sur Self Love, Mindset et
  Workout : aucun débordement horizontal détecté.
- Examen de captures de Blog, Mode, Self Love, Mindset et Workout.
- Focus clavier du bouton « Ajouter la vidéo » confirmé : contour de 2 px,
  décalage de 3 px.
- Comparaison des règles sources contenant `header`, `heading`, `hero`, `intro`
  ou `eyebrow` dans les CSS modifiés : aucune différence.
- `git diff --check` réussi et compilation Vite réussie.

Pages de la comparaison avant/après : `/blog`, `/blog/mode`, `/self-love`,
`/sport`, `/sport/workout`, `/mindset`, `/manifestation`, `/routine`, `/diet`,
`/menu`, `/wishlist`, `/calendrier`, `/project`, `/a-propos`, `/faq`, `/contact`,
`/boutique`, `/panier`.

### Limites des vérifications

Les pages publiques ont été ouvertes normalement. Les pages privées ont été
rendues avec leurs vrais composants et providers dans une prévisualisation
locale temporaire, sans connexion ni données utilisateur. La navigation
protégée de l'application n'a pas été modifiée. Cette prévisualisation a été
retirée à la fin du contrôle.

Les états remplis avec des données personnelles, les opérations d'enregistrement
et toutes les modales n'ont pas fait l'objet d'un test fonctionnel exhaustif.
La compilation a été écrite dans un dossier externe pour préserver le `dist`
déjà modifié avant cet audit.

## 6. Éléments conservés et points d'attention

- Les nombreux `!important` globaux ne sont pas supprimés en bloc : cela
  réactiverait des styles locaux jusque-là masqués et modifierait les headers.
- Les imports actifs de Libre Baskerville restent locaux. Italiana est chargée
  par Routine ; déplacer ce chargement pourrait modifier le rendu initial des
  headers sur les autres pages. Ce point relève d'un travail explicitement
  autorisé sur les headers, pas de cette harmonisation.
- Les boutons fonctionnels, liens éditoriaux, pastilles de plateforme, contrôles
  d'agenda et éléments décoratifs gardent des variantes adaptées à leur rôle.
- Les couleurs d'état, animations et styles de lettres ne sont pas assimilés à
  des incohérences à effacer.
- Le build signale encore un chemin d'image `heidi-østergaad-dupe.webp` non résolu
  et des bundles volumineux. Ces avertissements existaient avant l'intervention ;
  les avertissements d'imports CSS mal placés ont disparu.

Pour les prochains composants, choisir d'abord un rôle et un token existant.
Avant d'ajouter une propriété locale, vérifier sa valeur calculée et sa priorité
dans la cascade. Un sélecteur plus précis ne gagne pas contre un `!important`.
