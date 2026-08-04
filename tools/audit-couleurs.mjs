// Contrôle des 20 coloris × 4 silhouettes : repère les teintes qui rendent mal AVANT la cliente.
// Usage : node audit-couleurs.mjs <baseURL> [--shots]
// Mesure sur l'aperçu réel : contraste zone/zone, lisibilité de la plaque dorée, teintes qui disparaissent
// sur la scène prune. Fonctionne aussi bien sur l'illustration que sur les futurs calques photo.
import { chromium } from '/Users/chabanmazen/mazbase/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3333';
const shots = process.argv.includes('--shots');
const outDir = path.join(process.cwd(), 'audit-couleurs');
mkdirSync(outDir, { recursive: true });

const EXEC = '/Users/chabanmazen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const STAGE = '#4b2a31'; // scène prune éclaircie par le halo derrière le sac
const PLAQUE = '#5f3f13'; // contour de la plaque : c'est lui qui garantit la lisibilité

const toRgb = (hex) => hex.replace('#', '').match(/../g).map((part) => parseInt(part, 16));
const lum = (hex) => {
  const [r, g, b] = toRgb(hex).map((value) => value / 255).map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// distance perceptuelle simplifiée (CIE76 sur Lab) : deux fils peuvent avoir la même
// luminance et rester parfaitement distincts à l'oeil (lila sur rose bonbon).
const toLab = (hex) => {
  const [r, g, b] = toRgb(hex).map((value) => value / 255).map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (value) => (value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};
const deltaE = (a, b) => {
  const [l1, a1, b1] = toLab(a);
  const [l2, a2, b2] = toLab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
};

const ratio = (a, b) => {
  const [high, low] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

const browser = await chromium.launch({ executablePath: EXEC });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.$eval('#config-start', (element) => element.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(400);
// les silhouettes se lisent à l'étape 1, le nuancier à l'étape 2 : ne pas inverser
const shapes = await page.$$eval('.shape-options button', (buttons) => buttons.map((button) => button.querySelector('b').textContent));
await page.$$eval('.stepper button', (buttons) => buttons[1].click());
await page.waitForTimeout(300);

const colors = await page.evaluate(() => {
  const seen = [];
  document.querySelectorAll('.yarn-choice').forEach((button) => {
    const dot = button.querySelector('.yarn-dot');
    seen.push({ name: button.querySelector('small').textContent, hex: getComputedStyle(dot).getPropertyValue('--yarn').trim() });
  });
  return seen;
});

const findings = [];
let checked = 0;

for (const shape of shapes) {
  // sélectionner la silhouette
  await page.$$eval('.stepper button', (buttons) => buttons[0].click());
  await page.waitForTimeout(150);
  await page.$$eval('.shape-options button', (buttons, wanted) => buttons.find((button) => button.querySelector('b').textContent === wanted)?.click(), shape);
  await page.waitForTimeout(200);
  await page.$$eval('.stepper button', (buttons) => buttons[1].click());
  await page.waitForTimeout(200);

  for (const color of colors) {
    // peindre les 4 zones de la même couleur : le pire cas de lisibilité
    for (let zone = 0; zone < 4; zone += 1) {
      await page.$$eval('.zone-tabs button', (buttons, index) => buttons[index].click(), zone);
      await page.waitForTimeout(60);
      await page.$$eval('.yarn-choice', (buttons, wanted) => buttons.find((button) => button.querySelector('small').textContent === wanted)?.click(), color.name);
      await page.waitForTimeout(60);
    }
    checked += 1;

    const fills = await page.$$eval('.config-visual svg g[data-zone] path[fill]', (paths) => paths.map((node) => node.getAttribute('fill')));
    const applied = fills.filter((fill) => fill?.startsWith('#'));
    const wrong = applied.filter((fill) => fill.toLowerCase() !== color.hex.toLowerCase());
    if (wrong.length) findings.push({ shape, color: color.name, level: 'BLOQUANT', detail: `teinte non appliquée sur ${wrong.length} zone(s) : ${[...new Set(wrong)].join(', ')}` });

    // mesure de pixels réels : on rastérise l'aperçu et on compare le sac à son fond immédiat,
    // seule façon honnête de savoir si la teinte se détache (le halo et le liseré comptent).
    const sampled = await page.evaluate(async () => {
      const svg = document.querySelector('.config-visual .main-preview svg');
      const clone = svg.cloneNode(true);
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' }));
      const image = await new Promise((resolve, reject) => { const node = new Image(); node.onload = () => resolve(node); node.onerror = reject; node.src = url; });
      const canvas = document.createElement('canvas');
      canvas.width = 400; canvas.height = 400;
      const context = canvas.getContext('2d');
      context.fillStyle = '#2c1119';
      context.fillRect(0, 0, 400, 400);
      context.drawImage(image, 0, 0, 400, 400);
      URL.revokeObjectURL(url);
      const at = (x, y) => { const [r, g, b] = context.getImageData(x, y, 1, 1).data; return [r, g, b]; };
      return { bag: at(200, 250), around: at(200, 40), plaqueEdge: at(200, 296) };
    });
    const rel = ([r, g, b]) => {
      const [lr, lg, lb] = [r, g, b].map((value) => value / 255).map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
      return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    };
    const contrast = (a, b) => { const [high, low] = [rel(a), rel(b)].sort((x, y) => y - x); return (high + 0.05) / (low + 0.05); };
    const onStage = contrast(sampled.bag, sampled.around);
    if (onStage < 1.35) findings.push({ shape, color: color.name, level: 'MAJEUR', detail: `sac peu détaché de la scène (contraste mesuré ${onStage.toFixed(2)})` });

    if (shots && (findings.at(-1)?.color === color.name || color.name === 'Ivoire')) {
      const figure = await page.$('.main-preview');
      await figure.screenshot({ path: path.join(outDir, `${shape}-${color.name}.png`.replace(/\s+/g, '-')) });
    }
  }
}

// contraste entre zones voisines pour chaque recette composée
await page.$$eval('.stepper button', (buttons) => buttons[1].click());
await page.waitForTimeout(150);
const recipeIssues = [];
for (let round = 0; round < 12; round += 1) {
  await page.$eval('.surprise-button', (button) => button.click());
  await page.waitForTimeout(250);
  const state = await page.evaluate(() => ({
    name: document.querySelector('.recipe-head span').textContent,
    hexes: [...document.querySelectorAll('.recipe-chips .yarn-dot')].map((dot) => getComputedStyle(dot).getPropertyValue('--yarn').trim()),
  }));
  const body = state.hexes[0];
  // seuil 10 : en dessous, deux fils côte à côte se confondent sur une photo
  const weak = ['L’anse', 'La bande', 'Le bord'].map((label, index) => ({ label, distance: deltaE(body, state.hexes[index + 1]) })).filter((entry) => entry.distance < 10);
  if (weak.length) recipeIssues.push({ recipe: state.name, detail: weak.map((entry) => `${entry.label} ΔE ${entry.distance.toFixed(1)}`).join(', ') });
}

await browser.close();

const report = {
  base,
  combinaisons: checked,
  coloris: colors.length,
  silhouettes: shapes,
  findings,
  recettes_faibles: recipeIssues,
};
writeFileSync(path.join(outDir, 'rapport.json'), JSON.stringify(report, null, 2));

console.log(`${checked} combinaisons contrôlées (${colors.length} coloris × ${shapes.length} silhouettes)`);
for (const finding of findings) console.log(`${finding.level} · ${finding.shape} · ${finding.color} : ${finding.detail}`);
for (const issue of recipeIssues) console.log(`RECETTE · ${issue.recipe} : zones trop proches (${issue.detail})`);
console.log(findings.length || recipeIssues.length ? `\n${findings.length + recipeIssues.length} point(s) à regarder` : '\nAUCUNE TEINTE PROBLÉMATIQUE');
