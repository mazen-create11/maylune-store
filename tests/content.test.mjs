import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../src/app/page.js', import.meta.url), 'utf8');

test('la marque et les leviers de conversion sont présents', () => {
  for (const term of ['MAYLUNE', 'Créer ma signature', 'Ajouter au panier', 'Livraison offerte', 'FAQ']) {
    assert.ok(page.includes(term), `contenu manquant : ${term}`);
  }
});

test('le catalogue propose quatre signatures', () => {
  for (const product of ['Rosalie', 'Capri', 'Colette', 'Mini Muse']) {
    assert.ok(page.includes(product), `produit manquant : ${product}`);
  }
});

test('les paiements sont intégrés et les duos retirés', () => {
  for (const term of ['Visa', 'Mastercard', 'Apple Pay', 'Klarna']) {
    assert.ok(page.includes(term), `élément commercial manquant : ${term}`);
  }
  // duos retirés sur décision du 03/08/2026 — ne doivent pas réapparaître sans ordre
  for (const term of ['Le Duo Couleur', 'Le Weekender', 'Le Duo Sœurs']) {
    assert.ok(!page.includes(term), `duo présent alors que retiré : ${term}`);
  }
});
