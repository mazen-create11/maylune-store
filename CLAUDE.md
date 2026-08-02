# MAYLUNE

Prototype e-commerce Next.js d’une marque premium de sacs crochetés personnalisables. Le produit vendu est l’expérience de composition et l’expression personnelle, pas seulement le sac.

## Sources de vérité

- Mémoire projet : `/Users/chabanmazen/Cerveau/project_maylune.md`
- Page principale et logique : `src/app/page.js`
- Direction artistique et responsive : `src/app/globals.css`
- Métadonnées : `src/app/layout.js`
- Visuels : `public/images/`
- Logos de paiement : `public/payments/`

## Direction verrouillée

- Marque : MAYLUNE, toujours en capitales.
- Palette d’interface : ivoire dominant, brun encre, corail d’action, or discret. Les autres couleurs restent dans les produits.
- Typographie : Bodoni 72/Didot pour l’éditorial, Avenir Next/Manrope pour l’interface.
- Ton : français précis, désirable et concret. Éviter les clichés génériques du luxe.
- Parcours : silhouette → palette → détails → plaque, avec aperçu et prix en direct.

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

Lint, trois tests, build Next.js et parcours automatisé desktop/mobile validés. Le panier, la FAQ, le menu mobile et le configurateur jusqu’à 107 € ont été testés sans erreur navigateur ni débordement horizontal.

Avant commercialisation, valider les coûts et marges, les délais réels, les mentions légales, la disponibilité INPI/EUIPO de MAYLUNE et le nom de domaine.
