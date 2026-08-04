# Images à générer (Codex) · état 04/08/2026

## 0. ⭐ PRIORITÉ ABSOLUE : les 4 silhouettes en calques (bascule du moteur d'aperçu)

L'aperçu du configurateur est piloté par un moteur à zones (`bagShapes` dans `src/app/page.js`) : il colore 4 zones selon la recette de la cliente et ajoute chaîne, franges, fil, poche et plaque. Il tourne aujourd'hui en illustration vectorielle. Pour passer aux vraies photos SANS perdre la réactivité, il faut des calques, pas une image plate.

**Contrat par silhouette** (rosalie, capri, colette, mini-muse), fond transparent, cadrage identique d'un calque à l'autre, 1400×1400 PNG puis WebP :

| Fichier | Contenu | Rôle dans le moteur |
|---|---|---|
| `<slug>-body.png` | le sac SANS anse, en **blanc/gris neutre** (le fil doit être blanc cassé pour accepter la teinte) | zone 0, teintée par la 1re couleur |
| `<slug>-handle.png` | l'anse seule, même neutre | zone 1, 2e couleur |
| `<slug>-band.png` | la bande ou le rabat seul | zone 2, 3e couleur |
| `<slug>-edge.png` | le bord ou la couture basse | zone 3, 4e couleur |
| `<slug>-shade.png` | ombres et lumières du sac, en **noir semi-transparent uniquement** | posé en `multiply` par-dessus les zones teintées |
| `<slug>-chain-or.png` / `-chain-argent.png` | la chaîne seule, dorée / argentée | finition chaîne |
| `<slug>-fringe.png` | les franges seules, neutres | finition franges, teintée par la 1re couleur |
| `<slug>-pocket.png` | zip et tirette seuls | finition poche |
| `<slug>-plaque.png` | la plaque dorée vide (sans lettres) | les initiales sont écrites par-dessus en CSS |

Règles non négociables : **même point de vue, même échelle, même éclairage** pour tous les calques d'une silhouette (sinon les couches ne se superposent pas) ; fil photographié en blanc neutre, jamais coloré (la teinte est appliquée en CSS) ; aucune ombre portée dans les calques de zone (elle vit dans `-shade`).

Prompt modèle (remplacer le slug et la partie) :
> Photo produit d'un sac au crochet en fil de coton **blanc cassé neutre**, {DESCRIPTION DE LA FORME}, photographié de face, éclairage studio doux et uniforme, fond transparent, aucune ombre portée, cadrage centré identique, maille bien lisible, style catalogue premium. Ne montrer que {LA PARTIE}, le reste du sac absent.

Descriptions de forme : rosalie = mini sac à rabat structuré et anse courte ; capri = sac épaule arrondi en croissant à anse tressée ; colette = cabas rectangulaire à deux anses ; mini-muse = mini sac épaule ovale.

Quand les calques sont livrés, je bascule le moteur dessus : la logique de zones, les finitions et le prix ne changent pas d'une ligne.

---


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
