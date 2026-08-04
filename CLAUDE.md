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

- **Couleurs offertes, matière payante** : recette de 1 à 4 couleurs incluses dans le prix (16 coloris, 4 familles, rôles Dominante/Compagne/Accent/Touche). Options payantes : chaîne dorée ou argentée +10 € (exclusives), franges +5 €, fil métallisé doré ou argenté +3 € (exclusifs), poche zippée +8 €, plaque initiales +8 €.
- **Grille de prix sous les seuils** : Mini Muse 49 · Rosalie 59 · Capri 69 · Colette 99. Livraison offerte dès 79 €.
- Pas de faux rendu couleur : l’aperçu montre la silhouette + la recette (barre proportionnelle) ; l’atelier confirme par photo des fils avant confection.
- Duos/bundles toujours retirés (03/08) et palettes fixes retirées (04/08) : ne pas les réintroduire sans ordre. `tests/content.test.mjs` verrouille tout ça.
- ⏳ À confirmer par la cliente : faisabilité atelier des franges et du fil métallisé.

## Activation Shopify

Connecteur Storefront : `src/lib/shopify.js`. Variables : `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`, variantes produits (`…_VARIANT_ROSALIE/CAPRI/COLETTE/MINI_MUSE`) et options (`…_VARIANT_CHAINE_OR/CHAINE_ARGENT/FRANGES/FIL_DORE/FIL_ARGENT/POCHE/INITIALS`). Le checkout reste dormant tant que tout n’est pas fourni.

## Vérification

```bash
npm run lint && npm test && npm run build
```

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

## État au 4 août 2026

EN LIGNE : refonte « Rose Atelier » déployée et vérifiée live (30/30 contrôles desktop + mobile). Lint, 6 tests, build statique OK. Reste : photos de pelotes (voir `docs/IMAGES-CODEX.md`, câblage `image:` dans `yarnColors`), retour cliente sur franges/fil métallisé, puis socle Shopify, INPI/EUIPO classe 18, domaine, coûts/marges réels.
