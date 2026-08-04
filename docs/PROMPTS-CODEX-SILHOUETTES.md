# Prompts Codex · calques photo des 4 silhouettes

Objectif : passer l'aperçu du configurateur de l'illustration à la **vraie photo**, sans perdre la réactivité (20 coloris × 4 zones × finitions × initiales). La seule façon d'y arriver est de photographier chaque partie **séparément, en fil blanc neutre**, puis de laisser le code appliquer la couleur.

## La règle qui conditionne tout

> **Le fil doit être BLANC CASSÉ NEUTRE sur tous les calques de zone.** Jamais coloré.

Pourquoi : le site multiplie une couche de couleur par la photo en niveaux de gris. Un fil déjà rose ne pourra jamais devenir cobalt, et un fil déjà sombre étouffera toutes les teintes claires. Le blanc conserve les ombres, les reliefs de maille et les brillances : c'est ce qui donne le rendu réaliste une fois teinté.

Les seuls calques colorés sont les **chaînes** (or et argent), qui ne se teintent pas.

## Contraintes communes à TOUS les calques d'une même silhouette

Non négociables, sinon les couches ne se superposent pas :

1. **Même point de vue** : sac de face, légèrement de trois quarts (15° max), objectif à hauteur du sac.
2. **Même échelle et même position** dans le cadre : le sac occupe exactement la même place d'un calque à l'autre.
3. **Même éclairage** : lumière studio douce venant du haut à gauche, aucun changement entre les calques.
4. **Fond transparent** (PNG), aucune ombre portée dans les calques de zone.
5. **Format carré 1600 × 1600**, sac centré, marge de 10 % tout autour.
6. Maille bien lisible, netteté maximale sur la texture du crochet.

Astuce Codex : générer d'abord le sac complet en blanc, puis demander les découpes en repartant de cette image de référence. La cohérence sera bien meilleure qu'en générant chaque calque à l'aveugle.

## Les 4 silhouettes

| slug | description à réutiliser dans chaque prompt |
|---|---|
| `rosalie` | mini sac à main structuré, corps rectangulaire arrondi, rabat sur le tiers supérieur, anse courte rigide sur le dessus |
| `capri` | sac d'épaule en forme de croissant souple, base arrondie, anse tressée épaisse arquée |
| `colette` | grand cabas rectangulaire à base plate, deux anses parallèles, tenue structurée |
| `mini-muse` | mini sac d'épaule ovale, corps en galet, fine anse arquée |

## Les calques à produire (9 par silhouette)

Nommer exactement : `public/images/silhouettes/<slug>-<calque>.png`

| calque | contenu exact | ce que le code en fait |
|---|---|---|
| `body` | le corps du sac SEUL, sans anse, sans bande contrastée, sans bord | teinté par la couleur « Le corps » |
| `handle` | l'anse SEULE, flottant à sa position exacte, le reste absent | teinté par « L'anse » |
| `band` | la bande horizontale (haut du sac / rabat) SEULE | teinté par « La bande » |
| `edge` | le liseré du bas SEUL, sur 2 à 3 rangs de mailles | teinté par « Le bord » |
| `shade` | uniquement les ombres et lumières du sac complet, en noir et blanc, fond transparent | posé en multiply par-dessus, donne le relief |
| `chain-or` | la chaîne dorée SEULE, en place le long de l'anse | finition chaîne dorée (déjà colorée) |
| `chain-argent` | la même chaîne, en argenté | finition chaîne argentée (déjà colorée) |
| `fringe` | les franges SEULES, en fil blanc neutre, sous le sac | teinté par « Le corps » |
| `pocket` | le zip et sa tirette dorée SEULS, à l'intérieur du haut du sac | finition poche |
| `plaque` | la plaque ovale dorée VIDE, sans lettres | les initiales sont écrites par-dessus |

## Prompts prêts à copier

### 1. Référence (à générer en premier, sert de base aux 9 autres)

> Photo studio d'un sac au crochet en fil de coton blanc cassé neutre, {DESCRIPTION DE LA SILHOUETTE}, vu de face légèrement de trois quarts, éclairage studio doux venant du haut à gauche, fond gris clair uni, maille du crochet nette et lisible, aucune couleur autre que le blanc cassé, style catalogue premium, cadrage carré, le sac occupe 80 % de la hauteur.

### 2. Calques de zone (répéter pour body, handle, band, edge)

> À partir de cette image de référence, produis exactement le même sac, même cadrage, même échelle, même lumière, mais ne conserve QUE {LA PARTIE}. Tout le reste du sac est absent, fond transparent, aucune ombre portée. Le fil reste blanc cassé neutre.

Remplacer {LA PARTIE} par : « le corps du sac, sans anse ni bande ni liseré du bas » · « l'anse seule » · « la bande horizontale du haut » · « le liseré des deux derniers rangs, en bas ».

### 3. Ombres

> À partir de la référence, produis uniquement la carte d'ombres et de lumières du sac : noir et blanc, les creux de maille en gris foncé, les reliefs en blanc, aucune couleur, fond transparent, même cadrage et même échelle.

### 4. Chaîne (2 variantes)

> À partir de la référence, ajoute une chaîne fine en acier {doré / argenté} de 120 cm accrochée aux deux extrémités de l'anse, puis ne conserve QUE la chaîne. Le sac est absent, fond transparent, même cadrage, même lumière.

### 5. Franges

> À partir de la référence, ajoute une rangée de franges au crochet en fil blanc cassé neutre sous le sac, puis ne conserve QUE les franges. Le sac est absent, fond transparent, même cadrage.

### 6. Poche zippée

> À partir de la référence, ajoute une fermeture éclair fine avec tirette dorée à l'intérieur du haut du sac, puis ne conserve QUE la fermeture et sa tirette. Le reste est absent, fond transparent, même cadrage.

### 7. Plaque

> Plaque ovale en métal doré brossé, vide, sans aucune inscription ni lettre, vue de face, léger relief, fond transparent, éclairage doux, rendu photo réaliste.

## Livraison

Déposer les PNG dans `public/images/silhouettes/`. Je m'occupe de la conversion WebP, du masquage, des blend modes et de la bascule du moteur : la logique de zones, les finitions, le prix et le panier ne bougent pas d'une ligne.

Si une silhouette est livrée incomplète, elle continue de s'afficher en illustration : la bascule se fait silhouette par silhouette, sans casser le site.
