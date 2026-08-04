# Images à générer (Codex) · état 04/08/2026

Le site fonctionne sans elles (pastilles CSS en attendant). Chaque photo livrée remplace sa pastille automatiquement après câblage (1 ligne par coloris).

## 1. Les 16 pelotes du nuancier (priorité)

Fichiers attendus : `public/images/yarn/<id>.webp`, carré 400×400, < 60 Ko.
Câblage : dans `src/app/page.js`, renseigner `image: '/images/yarn/<id>.webp'` sur chaque entrée de `yarnColors`.

Prompt modèle (remplacer nom + hex) :
> Macro photo d'une pelote de fil de coton recyclé type t-shirt yarn, couleur {NOM} exactement {HEX}, enroulée serrée et régulière, posée sur fond uni rose poudré #f7e9e7, lumière naturelle douce venant de la gauche, ombre portée délicate, style éditorial premium, cadrage carré serré sur la pelote, aucun texte.

| id | nom | hex |
|---|---|---|
| ivoire | Ivoire | #f1eae0 |
| creme | Crème | #eadfc6 |
| nude | Nude | #d8b697 |
| sable | Sable | #c1a17b |
| rose-poudre | Rose poudré | #ecc4cd |
| vieux-rose | Vieux rose | #c68b9f |
| bonbon | Rose bonbon | #ec7cab |
| fuchsia | Fuchsia | #cf2f7b |
| beurre | Beurre | #f0d999 |
| moutarde | Moutarde | #d3962f |
| abricot | Abricot | #e28153 |
| coquelicot | Coquelicot | #bf3a2b |
| bordeaux | Bordeaux | #772335 |
| aubergine | Aubergine | #5a3852 |
| lila | Lila | #b191ba |
| violet | Violet | #67478c |
| ciel | Ciel | #a9c3da |
| sauge | Sauge | #a9bd8f |
| cobalt | Cobalt | #2b56b6 |
| marine | Marine | #2a3a5c |

(20 coloris depuis le 04/08 : famille « Les froids » confirmée par la cliente.)

Les pastilles sont affichées en cercle : centrer la pelote, marges perdues acceptées.

## 2. Finitions (optionnel, remplace les puces icône)

`public/images/finish-{chaine-or,chaine-argent,franges,fil-dore,fil-argent,poche}.webp`, carré 400×400 : macro du détail posé sur crochet, même fond #f7e9e7, même lumière.

## 3. L'atelier de Joudy (priorité 2, remplace `atelier.webp`)

La section savoir-faire est maintenant signée « Crocheté par Joudy » : la photo doit montrer SON univers, pas un atelier générique.

Fichier : `public/images/atelier.webp` (remplacement, portrait ~4:5, < 300 Ko).
Prompt :
> Photo éditoriale d'un petit atelier de crochet installé dans une maison lumineuse : table en bois clair, paniers de pelotes de fil t-shirt yarn dans des tons rose poudré, framboise, bordeaux, moutarde et ivoire, mains féminines en train de crocheter un sac framboise au premier plan, crochet doré, lumière naturelle douce de fin de matinée par une fenêtre, ambiance chaleureuse et soignée, aucun visage visible, aucun texte, style premium artisanal.

Optionnel : `public/images/atelier-detail.webp` (carré) :
> Macro des mains crochetant une maille serrée de fil framboise, crochet métallique doré, pelote floue en arrière-plan sur fond rose poudré, lumière naturelle, aucun texte.

## 4. Ambiances (optionnel, quand la DA rose doit gagner les photos)

Les visuels produits actuels restent valables (les couleurs vivent dans les produits). Si refresh souhaité : hero porté avec sac framboise/rose poudré, campagne 3 sacs aux recettes contrastées, atelier avec pelotes roses au premier plan. Formats et noms actuels conservés (`hero-maylune.webp`, `campaign.webp`, `atelier.webp`).
