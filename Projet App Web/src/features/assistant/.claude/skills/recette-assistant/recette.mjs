/* Recette d'acceptation du lot ASSIST-01, rejouée dans Chrome.
 *
 * Reprend point par point les contrôles 5.3.a à 5.3.f du ticket #4 et imprime
 * OK ou ÉCHEC pour chacun. Sortie 1 si un contrôle échoue ou si la console du
 * navigateur a parlé.
 *
 * Prérequis : `npm run dev` tourne dans « Projet App Web ».
 * Usage : node .claude/skills/recette-assistant/recette.mjs [--out DOSSIER] */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function chargerPlaywright() {
  const cache = path.join(os.homedir(), '.npm/_npx');
  for (const d of fs.existsSync(cache) ? fs.readdirSync(cache) : []) {
    const p = path.join(cache, d, 'node_modules/playwright/index.js');
    if (fs.existsSync(p)) return import(pathToFileURL(p).href);
  }
  throw new Error('Playwright introuvable');
}
const mod = await chargerPlaywright();
const { chromium } = mod.chromium ? mod : mod.default;

const URL = 'http://localhost:5173/src/features/assistant/preview/index.html';
const argOut = process.argv.indexOf('--out');
const SORTIE = argOut === -1 ? '/tmp/assist' : path.resolve(process.argv[argOut + 1]);
fs.mkdirSync(SORTIE, { recursive: true });

let echecs = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'OK     ' : 'ÉCHEC  '} ${n}${d ? ' — ' + d : ''}`); if (!c) echecs++; };

const CHROME = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
  .find((c) => fs.existsSync(c));
const nav = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const ctx = await nav.newContext({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const erreurs = [];
p.on('pageerror', (e) => erreurs.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });

const zone = () => p.locator('[data-testid="assistant-under-test"]');
const bouton = (txt) => zone().getByRole('button', { name: txt, exact: true });

try {
  await p.goto(URL, { waitUntil: 'load', timeout: 8000 });
} catch {
  console.error(`Page d'aperçu injoignable sur ${URL}\nLancer d'abord « npm run dev » dans « Projet App Web ».`);
  await nav.close();
  process.exit(2);
}
await p.waitForTimeout(500);

/* --- a. le parcours produit une question valide ----------------------- */
await bouton('Santé').click();
await zone().locator('input[type="text"]').fill('Lyon');
await bouton('Chercher').click();
await p.waitForTimeout(150);
const envoyee = await p.locator('[data-testid="last-query"]').innerText();
ok('5.3.a  question construite', envoyee.includes('"lang":"fr"') && envoyee.includes('"category":"sante"') && envoyee.includes('"city":"Lyon"'), envoyee.trim());

/* le champ ville est facultatif : vidé, la clé disparaît de la question */
await zone().locator('input[type="text"]').fill('   ');
await bouton('Chercher').click();
await p.waitForTimeout(150);
const sansVille = await p.locator('[data-testid="last-query"]').innerText();
ok('5.3.a  ville vide omise', !sansVille.includes('"city"'), sansVille.trim());

/* --- b. les états sont visibles --------------------------------------- */
const attendus = {
  idle: 'Choisissez un besoin',
  loading: 'Recherche en cours',
  empty: 'Aucun résultat',
  error: 'La recherche a échoué',
};
for (const [etat, texte] of Object.entries(attendus)) {
  await p.locator(`button[data-status="${etat}"]`).click();
  await p.waitForTimeout(120);
  const vu = await zone().innerText();
  ok(`5.3.b  état ${etat}`, vu.includes(texte), texte);
  await p.screenshot({ path: `${SORTIE}/etat-${etat}.png` });
}
await p.locator('button[data-status="done"]').click();
await p.waitForTimeout(150);
const fini = await zone().innerText();
ok('5.3.b  état done', fini.includes('Réponse') && fini.includes('Fiches utiles'));
await p.screenshot({ path: `${SORTIE}/etat-done.png` });

/* --- f. bandeau mode sans IA ------------------------------------------ */
ok('5.3.f  bandeau mode sans IA', fini.includes('Mode sans IA'));

/* --- c. repli français quand la traduction manque --------------------- */
await bouton('English').click();
await p.waitForTimeout(150);
const anglais = await zone().innerText();
ok('5.3.c  interface en anglais', anglais.includes('Search') && anglais.includes('Useful guides'));
ok('5.3.c  fiche traduite en anglais', anglais.includes('Renewing a residence permit'));
ok('5.3.c  fiche sans traduction : repli français', anglais.includes('Demander une attestation de domicile'));
ok('5.3.c  aucun undefined à l\'écran', !anglais.includes('undefined'));
await p.screenshot({ path: `${SORTIE}/repli-francais.png` });
await bouton('Français').click();
await p.waitForTimeout(150);

/* --- d. parcours au clavier ------------------------------------------- */
await p.locator('button[data-status="idle"]').click();
await zone().locator('button').first().focus();
let atteints = 0, contour = false, valide = false;
for (let i = 0; i < 24; i++) {
  const info = await p.evaluate(() => {
    const a = document.activeElement;
    if (!a) return null;
    const s = getComputedStyle(a);
    return { tag: a.tagName, texte: (a.textContent || '').trim(), outline: s.outlineWidth, dansZone: Boolean(a.closest('[data-testid="assistant-under-test"]')) };
  });
  if (info?.dansZone && info.tag === 'BUTTON') {
    atteints++;
    if (info.outline !== '0px') contour = true;
    if (info.texte === 'Hébergement') {
      await p.keyboard.press('Enter');
      await p.waitForTimeout(120);
      valide = await bouton('Hébergement').getAttribute('aria-pressed') === 'true';
    }
  }
  await p.keyboard.press('Tab');
}
ok('5.3.d  boutons atteints au clavier', atteints >= 8, `${atteints} arrêts de tabulation`);
ok('5.3.d  contour de focus visible', contour);
ok('5.3.d  Entrée sélectionne comme un clic', valide);
await zone().getByRole('button', { name: 'Alimentation', exact: true }).focus();
await p.screenshot({ path: `${SORTIE}/clavier-focus.png` });

/* --- e. écran étroit 400 px ------------------------------------------- */
await p.setViewportSize({ width: 400, height: 900 });
await p.locator('button[data-status="done"]').click();
await p.waitForTimeout(300);
const debordement = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
ok('5.3.e  aucun débordement horizontal', debordement <= 0, `${debordement} px`);
const trop_petits = await p.evaluate(() => {
  const racine = document.querySelector('[data-testid="assistant-under-test"]');
  return [...racine.querySelectorAll('button, input')]
    .filter((e) => e.getBoundingClientRect().height < 44)
    .map((e) => `${e.tagName} "${(e.textContent || e.value || '').trim()}" ${Math.round(e.getBoundingClientRect().height)}px`);
});
ok('5.3.e  cibles d\'au moins 44 px', trop_petits.length === 0, trop_petits.join(' | '));
await p.screenshot({ path: `${SORTIE}/mobile-400.png`, fullPage: true });

await nav.close();
console.log(erreurs.length ? `\nConsole : ${erreurs.join(' | ')}` : '\nConsole : rien à signaler.');
console.log(`Captures : ${SORTIE}`);
process.exit(echecs > 0 || erreurs.length > 0 ? 1 : 0);
