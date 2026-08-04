import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../src/app/page.js', import.meta.url), 'utf8');

test('la marque et les leviers de conversion sont présents', () => {
  for (const term of ['MAYLUNE', 'Composer mon sac', 'Ajouter au panier', 'Livraison offerte', 'FAQ']) {
    assert.ok(page.includes(term), `contenu manquant : ${term}`);
  }
});

test('le catalogue propose quatre signatures', () => {
  for (const product of ['Rosalie', 'Capri', 'Colette', 'Mini Muse']) {
    assert.ok(page.includes(product), `produit manquant : ${product}`);
  }
});

test('le nuancier libre 1 à 4 couleurs est en place', () => {
  // décision du 04/08/2026 : couleurs incluses (min 1, max 4), options matière payantes
  // famille « Les froids » ajoutée le 04/08/2026 sur confirmation du stock (bleus + sauge)
  for (const term of ['Rose poudré', 'Fuchsia', 'Bordeaux', 'Moutarde', 'Cobalt', 'Sauge', 'La dominante', 'Quatre fils maximum', 'au moins une couleur']) {
    assert.ok(page.includes(term), `nuancier incomplet : ${term}`);
  }
  const colorCount = (page.match(/family: 'Les /g) || []).length;
  assert.equal(colorCount, 20, `le nuancier doit compter 20 coloris, trouvé ${colorCount}`);
});

test('la preuve sociale et l’atelier de Joudy sont en place', () => {
  // avis verbatim fournis par la cliente le 04/08/2026 ; les mentions site/service client ont été écartées
  for (const term of ['Déjà portées', 'ventes directes de l’atelier', 'Lily A.', 'Inès D.', 'rating: 4', 'Joudy']) {
    assert.ok(page.includes(term), `preuve sociale incomplète : ${term}`);
  }
  for (const forbidden of ['nouveau site', 'service client']) {
    assert.ok(!page.includes(forbidden), `avis incompatible réintroduit : ${forbidden}`);
  }
});

test('les options payantes sont présentes avec leurs prix', () => {
  for (const term of ['Chaîne dorée', 'Chaîne argentée', 'Franges', 'Fil doré', 'Poche zippée', 'price: 10', 'price: 5', 'price: 3', 'price: 8']) {
    assert.ok(page.includes(term), `option manquante : ${term}`);
  }
});

test('la grille de prix sous les seuils est appliquée', () => {
  for (const term of ['price: 49', 'price: 59', 'price: 69', 'price: 99']) {
    assert.ok(page.includes(term), `prix manquant : ${term}`);
  }
});

test('les paiements sont intégrés et les duos retirés', () => {
  for (const term of ['Visa', 'Mastercard', 'Apple Pay', 'Klarna']) {
    assert.ok(page.includes(term), `élément commercial manquant : ${term}`);
  }
  // duos retirés sur décision du 03/08/2026 : ne doivent pas réapparaître sans ordre
  for (const term of ['Le Duo Couleur', 'Le Weekender', 'Le Duo Sœurs']) {
    assert.ok(!page.includes(term), `duo présent alors que retiré : ${term}`);
  }
});
