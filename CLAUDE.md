# MAYLUNE

Prototype e-commerce Next.js d’une marque premium de sacs crochetés personnalisables. Le produit vendu est l’expérience de composition et l’expression personnelle, pas seulement le sac.

## Sources de vérité

- Mémoire projet : `/Users/chabanmazen/Cerveau/project_maylune.md`
- Page principale et logique : `src/app/page.js`
- Direction artistique et responsive : `src/app/globals.css`
- Métadonnées : `src/app/layout.js`
- Visuels servis : `public/images/` (WebP uniquement)
- Masters haute définition : `assets/source-images/`
- Logos de paiement : `public/payments/`

## Direction verrouillée

- Marque : MAYLUNE, toujours en capitales.
- Palette d’interface : ivoire dominant, brun encre, corail d’action, or discret. Les autres couleurs restent dans les produits.
- Typographie : Fraunces embarquée pour l’éditorial, Manrope embarquée pour l’interface.
- Ton : français précis, désirable et concret. Éviter les clichés génériques du luxe.
- Parcours : silhouette → palette → détails → plaque, avec aperçu et prix en direct.
- Continuité visuelle obligatoire : les 4 palettes, les finitions, la plaque et le panier doivent toujours conserver la silhouette choisie.
- Mobile : aperçu configurateur compact et sticky ; le CTA du hero doit ouvrir directement `#config-start`.
- Configurateur desktop : un seul aperçu plein cadre. Ne pas réintroduire de vignette photo flottante par-dessus le produit ; l’état actif est nommé dans le bandeau inférieur.
- Tant que Shopify n’est pas configuré, ne jamais afficher un faux paiement ou une fausse commande réussie.

## Activation Shopify

Le connecteur Storefront API est dans `src/lib/shopify.js`. Le checkout ne s’active que lorsque le domaine, le token Storefront et toutes les variantes produits/options sont fournis via les variables `NEXT_PUBLIC_SHOPIFY_*` documentées dans ce fichier.

## Vérification

```bash
npm run lint
npm test
npm run build
```

Serveur local habituel : `http://127.0.0.1:3333`.

## Déploiement GitHub Pages

- Repo : `https://github.com/mazen-create11/maylune-store` (main = source, gh-pages = build)
- URL live : `https://mazen-create11.github.io/maylune-store/`
- Piège payé : en export statique, next/image ne préfixe pas `basePath` sur les src → `image-loader.js` (custom loader) est obligatoire, ne pas le supprimer.

```bash
GITHUB_PAGES=1 npx next build
touch out/.nojekyll
cd out && git init -b gh-pages -q && git add -A && git commit -q -m "deploy" \
  && git push -f https://github.com/mazen-create11/maylune-store.git gh-pages
cd .. && rm -rf out/.git
```

## État au 3 août 2026

EN LIGNE : https://mazen-create11.github.io/maylune-store/ — lint, 3 tests, build statique et audit navigateur desktop/mobile validés (16 aperçus, panier persistant, 0 overflow, 0 image cassée, 0 erreur JS, 0 violation WCAG A/AA automatisée).

Décisions actées du 03/08 :
- **Duos/bundles retirés** sur ordre de Mazen — le test `content.test.mjs` interdit leur retour sans nouvel ordre.
- **Grille prix v2 alignée sous marché** (benchmark ELOOP/Laïli/Reka/LelouPassion/adèle.d) : Rosalie 59 € · Capri 74 € · Colette 109 € · Mini Muse 55 € · chaîne 8 € · poche 10 € · initiales 8 € · livraison offerte dès 79 €. Les concurrents incluent les options gratuitement : nos options payantes basses sont une différenciation assumée.
- Panneau composition = « étiquette d'atelier » (filet or, prix décomposé base + options) ; stepper à coches or ; configurateur mobile à une seule image (aperçu détail masqué ≤900px).
- Micro-typographie remontée (minimum 9px, courant 10-12px) — ne pas redescendre.
- Configurateur complet : matrice 4 silhouettes × 4 palettes, finitions propres à chaque modèle et plaque d'initiales positionnée sur le sac choisi. Toute nouvelle silhouette doit fournir cette matrice avant publication.
- Les images servies au navigateur sont en WebP ; les PNG haute définition du configurateur restent des masters locaux ignorés par Git.
- Fraunces remplace le fallback Bodoni non embarqué ; sitemap, robots, canonical GitHub Pages et page d’informations légales sont présents.
- Newsletter, liens sociaux, suivi de commande et moyens de paiement trompeurs ont été retirés tant que les services réels ne sont pas connectés.
- Le panier est persisté dans `localStorage`; le checkout Shopify conserve modèle, palette, finitions, initiales et identifiant de composition.
- Le paquet public est passé d’environ 64 Mo à 8,6 Mo en déplaçant les PNG masters hors de `public/`.

Vérification navigateur : harnais `verify-maylune.mjs` dans le scratchpad de session — utiliser le **headless shell** Playwright (`chromium_headless_shell-1208`), jamais l'app Chrome for Testing fenêtrée (dialogues de crash macOS chez Mazen).

Avant commercialisation, valider les coûts et marges, les délais réels, les mentions légales, la disponibilité INPI/EUIPO de MAYLUNE et le nom de domaine.
