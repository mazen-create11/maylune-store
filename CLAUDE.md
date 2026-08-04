# MAYLUNE

Prototype e-commerce Next.js d’une marque premium de sacs crochetés personnalisables. Le produit vendu est l’expérience de composition et l’expression personnelle, pas seulement le sac.

## Sources de vérité

- Mémoire projet : `/Users/chabanmazen/Cerveau/project_maylune.md`
- Page principale et logique : `src/app/page.js`
- Direction artistique et responsive : `src/app/globals.css`
- Métadonnées : `src/app/layout.js`
- Visuels servis : `public/images/` (WebP uniquement)
- Masters haute définition : `assets/source-images/`
- Plan d’images à générer : `docs/IMAGES-CODEX.md`

## Le moteur d'aperçu (cœur du produit, 04/08/2026)

L'aperçu n'est pas une photo figée : c'est un moteur qui redessine le sac à chaque décision. Toute évolution passe par lui.

- `bagShapes` (src/app/page.js) : par silhouette, 4 zones colorables (`body`, `handle`, `band`, `edge`) + ancrages `chain`, `fringe`, `pocket`, `plaque`, `longHandle`. Toute nouvelle silhouette doit fournir ce jeu complet avant publication.
- `bagZones` : les 4 zones nommées côté cliente (Le corps, L'anse, La bande, Le bord). **Chaque zone pioche dans les 20 coloris** : la contrainte « 1 à 4 couleurs » est structurelle (même couleur partout = uni), il n'y a plus rien à policer.
- `curatedRecipes` : 12 accords écrits à la main (4 ton sur ton, 4 contrastes doux, 4 francs) pour « Surprenez-moi ». ⛔ Ne jamais remplacer par un tirage aléatoire de couleurs : c'est un refus explicite de Mazen. Toute nouvelle recette doit renseigner les 4 zones.
- `BagPreview` : rendu SVG texturé maille, utilisé partout (grand aperçu, sticky mobile, cartes de silhouette, cartes de finition, étape plaque, vignettes du panier). Chaque finition a un rendu visible : chaîne dessinée dans son métal, franges dans la couleur du corps, fil métallisé tissé, poche avec zip et tirette, anses longues.
- `WornPreview` + `wornSetup` : vue « À l'épaule ». Corps de 168 cm dessiné sur 418 unités, soit **2,49 unités/cm** ; `scale = hauteur réelle du sac × 2,49 / hauteur de son tracé`. ⚠️ Les dimensions actuelles sont provisoires, à confirmer par Joudy ; les corriger dans `wornSetup` suffit, tout se recalcule.
- Lisibilité garantie par construction : halo radial derrière le sac et liseré clair sur le corps (sinon bordeaux, aubergine et marine se noient dans la scène prune) ; plaque à halo blanc + contour foncé (sinon elle disparaît sur nude, sable, ciel). Ne pas retirer.
- Bascule photo prévue sans changer la logique : contrat de calques dans `docs/PROMPTS-CODEX-SILHOUETTES.md` (fil photographié en BLANC NEUTRE, teinté par le code).

## Direction verrouillée · DA « Rose Atelier » (04/08/2026)

- Marque : MAYLUNE, toujours en capitales.
- Palette d’interface : fond rose poudré `#f7e9e7`, surfaces crème rosée, encre prune `#38161f`, action framboise `#b62d53`, prune vin `#5a1f31` pour les sections sombres, or `#8b6132`. Jamais de rose bonbon en aplat plein écran : les roses se superposent. Contrastes AA vérifiés au calcul (min 4,55).
- Coins adoucis (cartes 16px, puces 12px, CTA en pilule) : le crochet est rond.
- Typographie : Fraunces embarquée (axe SOFT 55 sur les titres) + Manrope embarquée. Zéro tiret cadratin dans les livrables (`grep -rn '—' src tests` doit rendre 0).
- Ton : français précis, désirable, concret. Peu de texte : les visuels portent.
- Parcours : silhouette → couleurs → finitions → plaque, prix en direct.
- Configurateur desktop : un seul aperçu plein cadre, pas de vignette flottante ; la recette est visible via la barre latérale de couleurs et le bandeau inférieur.
- Tant que Shopify n’est pas configuré : jamais de faux paiement ni de fausse commande.

## Décisions commerciales actées (04/08/2026, benchmark Cushy Lab + 20.due)

- **Couleurs offertes, matière payante** : les 20 coloris sont inclus, sur les 4 zones, sans supplément. Options payantes, 1 à 4 par sac : chaîne dorée ou argentée +10 € (exclusives entre elles), franges +5 €, fil métallisé doré ou argenté +3 € (exclusifs entre eux), poche zippée +8 €, anses longues +6 € (Colette), plaque initiales +8 €. Un remplacement dans un même groupe ne consomme pas de slot.
- **Grille de prix sous les seuils** : Mini Muse 49 · Rosalie 59 · Capri 69 · Colette 99. Livraison offerte dès 79 € ; sous ce seuil le tarif s'affiche au paiement (montant réel pas encore connu).
- **L'artisane est Joudy**, dans son atelier à la maison : nommée en section savoir-faire et en FAQ.
- **Avis** : 6 verbatim des ventes directes de l'atelier, présentés comme tels. Trois avis fournis ont été écartés (mentions de « nouveau site » et de service client inexistants, positionnement enfant) et `tests/content.test.mjs` interdit leur retour.
- Duos/bundles retirés (03/08) et palettes fixes retirées (04/08) : ne pas les réintroduire sans ordre.
- ⛔ Aucune donnée inventée : dimensions, matière, poids et tarif de livraison attendent Joudy. Les cotes de `wornSetup` sont des estimations à remplacer.
- ✅ Confirmé par la cliente : franges et fil métallisé réalisables, bleus et verts en stock (famille « Les froids »).

## Activation Shopify

Connecteur Storefront : `src/lib/shopify.js`. Variables : `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`, variantes produits (`…_VARIANT_ROSALIE/CAPRI/COLETTE/MINI_MUSE`) et options (`…_VARIANT_CHAINE_OR/CHAINE_ARGENT/FRANGES/FIL_DORE/FIL_ARGENT/POCHE/INITIALS`). Le checkout reste dormant tant que tout n’est pas fourni.

## Vérification

```bash
npm run lint && npm test && npm run build
grep -rn '—' src tests | wc -l   # doit rendre 0 : zéro tiret cadratin dans les livrables
```

Deux harnais navigateur (headless shell Playwright, jamais l'app Chrome fenêtrée) :

```bash
node verify-maylune.mjs <url>        # parcours complet, 15 contrôles × desktop/mobile
node tools/audit-couleurs.mjs <url>  # 20 coloris × 4 silhouettes = 80 combinaisons
```

`audit-couleurs` mesure sur les **pixels rendus** (rastérisation du SVG dans un canvas), jamais sur les couleurs théoriques : le halo et le liseré ne sont pas dans le hex du fil. Il compare aussi les zones entre elles en distance perceptuelle Lab, parce que le ratio de luminance ment (lila sur rose bonbon = 1,05 et pourtant parfaitement distincts). À rejouer intégralement le jour où les calques photo remplacent l'illustration.

Harnais navigateur : `verify-maylune.mjs` (scratchpad de session) — 15 contrôles × desktop/mobile : overflow, images, min 1/max 4 couleurs, exclusivité chaîne, prix 95 €, panier, FAQ, erreurs console. Utiliser playwright-core importé depuis `/Users/chabanmazen/mazbase/node_modules/playwright-core/index.mjs` et le binaire `~/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell` (jamais l’app Chrome for Testing fenêtrée). Captures : par viewport avec scroll progressif ; `scroll-behavior: smooth` décale les captures, scroller puis attendre.

## Déploiement GitHub Pages

- Repo : `https://github.com/mazen-create11/maylune-store` (main = source, gh-pages = build)
- URL live : `https://mazen-create11.github.io/maylune-store/`
- Piège payé : en export statique, next/image ne préfixe pas `basePath` → `image-loader.js` obligatoire. Vérifier `grep '/maylune-store/_next' out/index.html` avant push.

```bash
GITHUB_PAGES=1 npx next build
touch out/.nojekyll
cd out && git init -b gh-pages -q && git add -A && git commit -q -m "deploy" \
  && git push -f https://github.com/mazen-create11/maylune-store.git gh-pages
cd .. && rm -rf out/.git
```

Après push : rejouer le harnais sur l’URL live (un 200 ne prouve rien). Le marqueur fiable est le `<title>` : les étapes 2-4 du configurateur ne sont pas dans le HTML pré-rendu.

## État au 4 août 2026 (fin de journée)

EN LIGNE et vérifié sur la prod : parcours 30/30 desktop + mobile, 80 combinaisons couleur sans défaut, lint, 9 tests, build statique.

Livré dans la journée : DA « Rose Atelier », audit par trois personas et ses correctifs (vraie Fraunces Italic, sticky mobile réparé, garde anti double-clic, initiales translittérées), 20 coloris, avis de l'atelier, section Joudy, moteur d'aperçu par zones, couleur par zone, 12 recettes composées, partage « Voici mon MAYLUNE », vue « À l'épaule » cotée, harnais des 80 combinaisons.

Prochaine étape, dans l'ordre :
1. **Calques photo** — commencer par UNE silhouette complète (Capri, 13 calques), brancher la bascule, juger sur les 20 coloris, corriger les prompts, puis produire les trois autres. Prompts prêts : `docs/PROMPTS-CODEX-SILHOUETTES.md`.
2. **Chiffres de Joudy** : dimensions, matière, poids, longueur d'anse par silhouette → corrige `wornSetup` et débloque la fiche produit (onglet matière + schema.org Product).
3. Photos de pelotes (`docs/IMAGES-CODEX.md`) pour remplacer les pastilles CSS.
4. Socle Shopify, tarif de livraison, INPI/EUIPO classe 18, domaine, coûts et marges réels.
