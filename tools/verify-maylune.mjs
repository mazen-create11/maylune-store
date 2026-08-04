// Harnais de vérification MAYLUNE : parcours configurateur + intégrité visuelle.
// Usage : node verify-maylune.mjs <baseURL> [--shots]
import { chromium } from '/Users/chabanmazen/mazbase/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:3333';
const shots = process.argv.includes('--shots');
const shotDir = path.join(process.cwd(), 'shots');
if (shots) mkdirSync(shotDir, { recursive: true });

const executablePath = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const failures = [];
const note = (ok, label) => {
  console.log(`${ok ? 'OK ' : 'FAIL'} ${label}`);
  if (!ok) failures.push(label);
};

const browser = await chromium.launch({ executablePath });

async function audit(name, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Intégrité globale
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  note(overflow <= 0, `${name} : pas de débordement horizontal (delta ${overflow}px)`);
  const brokenImages = await page.evaluate(() => [...document.querySelectorAll('img')].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src')));
  note(brokenImages.length === 0, `${name} : images intactes ${brokenImages.length ? brokenImages.join(', ') : ''}`);

  // Parcours configurateur
  await page.$eval('#config-start', (element) => element.scrollIntoView());
  await page.waitForTimeout(400);

  // Étape 2 : couleurs par zone
  await page.$$eval('.stepper button', (buttons) => buttons[1].click());
  await page.waitForTimeout(250);
  const dots = await page.$$('.yarn-choice');
  note(dots.length === 20, `${name} : nuancier de 20 coloris (${dots.length})`);
  const zoneTabs = await page.$$('.zone-tabs button');
  note(zoneTabs.length === 4, `${name} : quatre zones colorables (${zoneTabs.length})`);

  // peindre chaque zone d'une couleur distincte
  const plan = [['Le corps', 'Fuchsia'], ['L\u2019anse', 'Bordeaux'], ['La bande', 'Beurre'], ['Le bord', 'Cobalt']];
  for (const [zone, color] of plan) {
    await page.$$eval('.zone-tabs button', (buttons, wanted) => buttons.find((button) => button.textContent.includes(wanted))?.click(), zone);
    await page.waitForTimeout(120);
    await page.$$eval('.yarn-choice', (buttons, wanted) => buttons.find((button) => button.querySelector('small')?.textContent === wanted)?.click(), color);
    await page.waitForTimeout(120);
  }
  const painted = await page.$$eval('.recipe-chips button', (chips) => chips.map((chip) => chip.querySelector('b')?.textContent));
  note(JSON.stringify(painted) === JSON.stringify(['Fuchsia', 'Bordeaux', 'Beurre', 'Cobalt']), `${name} : chaque zone garde sa couleur (${painted.join(', ')})`);
  const distinct = await page.$eval('.recipe-head b', (element) => element.textContent);
  note(distinct.startsWith('4 couleurs'), `${name} : compteur de couleurs distinctes (${distinct})`);
  const fills = await page.$$eval('.config-visual svg g[data-zone] path', (paths) => paths.map((path) => path.getAttribute('fill')).filter(Boolean));
  note(new Set(fills).size >= 4, `${name} : l\u2019aperçu applique 4 teintes distinctes (${new Set(fills).size})`);

  // une seule couleur partout = sac uni, aucun blocage
  for (const zone of ['Le corps', 'L\u2019anse', 'La bande', 'Le bord']) {
    await page.$$eval('.zone-tabs button', (buttons, wanted) => buttons.find((button) => button.textContent.includes(wanted))?.click(), zone);
    await page.waitForTimeout(100);
    await page.$$eval('.yarn-choice', (buttons) => buttons.find((button) => button.querySelector('small')?.textContent === 'Ivoire')?.click());
    await page.waitForTimeout(100);
  }
  const uni = await page.$eval('.recipe-head b', (element) => element.textContent);
  note(uni.startsWith('1 couleur'), `${name} : sac uni possible (${uni})`);

  // Surprenez-moi applique une recette composée
  await page.$eval('.surprise-button', (button) => button.click());
  await page.waitForTimeout(350);
  const recipeTitle = await page.$eval('.recipe-head span', (element) => element.textContent);
  note(recipeTitle.startsWith('Recette '), `${name} : Surprenez-moi applique un accord nommé (${recipeTitle})`);

  // recomposer pour la suite du parcours
  await page.$$eval('.zone-tabs button', (buttons) => buttons[0].click());
  await page.waitForTimeout(100);
  await page.$$eval('.yarn-choice', (buttons) => buttons.find((button) => button.querySelector('small')?.textContent === 'Fuchsia')?.click());
  await page.waitForTimeout(120);

  // Étape 3 : exclusivité chaîne or/argent
  await page.$$eval('.stepper button', (buttons) => buttons[2].click());
  await page.waitForTimeout(250);
  await page.$$eval('.finish-cards button', (buttons) => buttons.find((button) => button.textContent.includes('Chaîne dorée'))?.click());
  await page.waitForTimeout(120);
  await page.$$eval('.finish-cards button', (buttons) => buttons.find((button) => button.textContent.includes('Chaîne argentée'))?.click());
  await page.waitForTimeout(120);
  const chainState = await page.$$eval('.finish-cards button.selected', (buttons) => buttons.map((button) => button.textContent));
  note(chainState.length === 1 && chainState[0].includes('argentée'), `${name} : chaîne or/argent exclusive`);
  await page.$$eval('.finish-cards button', (buttons) => buttons.find((button) => button.textContent.includes('Poche zippée'))?.click());
  await page.waitForTimeout(120);

  // Étape 4 : initiales + prix total attendu = 69 (Capri) + 10 + 8 + 8 = 95
  await page.$$eval('.stepper button', (buttons) => buttons[3].click());
  await page.waitForTimeout(250);
  await page.fill('#initials', 'al');
  await page.waitForTimeout(120);
  const initialsValue = await page.$eval('#initials', (input) => input.value);
  note(initialsValue === 'AL', `${name} : initiales normalisées (${initialsValue})`);
  const total = await page.$eval('.config-top-price b', (element) => element.textContent.trim());
  note(total === '95 €', `${name} : total 95 € (${total})`);

  // Ajout panier
  await page.$$eval('.config-actions .button', (buttons) => buttons[buttons.length - 1].click());
  await page.waitForTimeout(500);
  const cartCount = await page.$eval('.cart-button b', (element) => element.textContent);
  note(cartCount === '1', `${name} : article au panier (${cartCount})`);
  const cartDetail = await page.$eval('.cart-item p', (element) => element.textContent);
  note(cartDetail.includes('Fuchsia') && cartDetail.includes('AL'), `${name} : détail panier fidèle (${cartDetail})`);
  const cartSvg = await page.$$('.cart-item .cart-thumb svg');
  note(cartSvg.length === 1, `${name} : vignette panier rendue par le moteur`);
  const cartPrice = await page.$eval('.cart-item strong', (element) => element.textContent.trim());
  note(cartPrice === '95 €', `${name} : prix panier (${cartPrice})`);
  await page.$eval('.cart-drawer .icon-button', (button) => button.click());
  await page.waitForTimeout(300);

  // FAQ
  await page.$$eval('.faq-item button', (buttons) => buttons[1].click());
  await page.waitForTimeout(300);
  const faqOpen = await page.$$eval('.faq-item.open', (items) => items.length);
  note(faqOpen === 1, `${name} : FAQ interactive`);

  note(errors.length === 0, `${name} : zéro erreur navigateur ${errors.length ? errors.join(' | ') : ''}`);

  if (shots) {
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = viewport.height;
    for (let offset = 0, index = 0; offset < pageHeight && index < 12; offset += step, index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), offset);
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(shotDir, `${name}-${String(index).padStart(2, '0')}.png`) });
    }
  }
  await page.close();
}

await audit('desktop', { width: 1440, height: 900 });
await audit('mobile', { width: 390, height: 844 });
await browser.close();

console.log(failures.length ? `\n${failures.length} ÉCHEC(S)` : '\nTOUT EST VERT');
process.exit(failures.length ? 1 : 0);
