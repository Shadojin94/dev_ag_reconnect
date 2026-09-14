#!/usr/bin/env node
/* Rend la landing page ONZE dans Chrome et capture le jeu de vues canoniques.
 *
 *   node rendu.mjs                      toutes les vues
 *   node rendu.mjs scout tables         seulement celles-là
 *   node rendu.mjs --out /tmp/x --page Ashad/index.html
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));

/* --------------------------------------------------------- Playwright --
 * Playwright n'est pas une dépendance du dépôt : on le prend là où npx l'a
 * laissé. Le nom du dossier de cache change d'une machine à l'autre, donc on
 * le cherche au lieu de le figer. */
async function chargerPlaywright() {
  try { return await import('playwright'); } catch { /* pas installé ici */ }
  const cache = path.join(os.homedir(), '.npm/_npx');
  const dossiers = fs.existsSync(cache) ? fs.readdirSync(cache) : [];
  for (const d of dossiers) {
    const p = path.join(cache, d, 'node_modules/playwright/index.js');
    if (fs.existsSync(p)) return import(pathToFileURL(p).href);
  }
  throw new Error("Playwright introuvable. Lancer une fois : npx playwright@latest --version");
}

/* Importé par chemin, le paquet expose tout sur son export par défaut. */
const mod = await chargerPlaywright();
const { chromium } = mod.chromium ? mod : mod.default;

/* Chrome du système d'abord : le Chromium livré avec Playwright n'est pas
 * toujours téléchargé, alors que Chrome, lui, est là. */
const NAVIGATEUR = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
  .find((p) => fs.existsSync(p));

/* ------------------------------------------------------------ options -- */
const args = process.argv.slice(2);
function option(nom, defaut) {
  const i = args.indexOf(nom);
  if (i === -1) return defaut;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
}
const SORTIE = path.resolve(option('--out', '/tmp/onze-rendu'));
const PAGE = (() => {
  const donne = option('--page', null);
  if (donne) return path.resolve(donne);
  // le skill est rangé dans <projet>/.claude/skills/rendu-onze/ : on remonte
  // jusqu'au projet, ce qui rend le script indépendant du dossier courant
  const candidats = [
    path.resolve(ICI, '../../../index.html'),
    path.resolve('Ashad/index.html'),
    path.resolve('index.html'),
  ];
  const p = candidats.find((c) => fs.existsSync(c));
  if (!p) throw new Error('index.html introuvable — préciser --page CHEMIN');
  return p;
})();

/* --------------------------------------------------------------- vues --
 * `action` reçoit la page et met en scène ce qu'il faut voir : un survol, un
 * poste sélectionné, un tableau déplié. */
const VUES = {
  'desktop-sombre': { w: 1440, h: 1000, theme: 'sombre', entiere: true },
  'desktop-clair':  { w: 1440, h: 1000, theme: 'clair',  entiere: true },
  'mobile-sombre':  { w: 390,  h: 844,  theme: 'sombre', entiere: true },

  'hover-charge': { w: 1440, h: 900, theme: 'sombre', action: async (p) => {
    const barre = p.locator('#charge-bars .barslot').nth(2);
    await barre.scrollIntoViewIfNeeded();
    await barre.hover();
    await p.waitForTimeout(250);
  }},

  scout: { w: 1440, h: 1100, theme: 'sombre', action: async (p) => {
    await p.locator('#recrutement').scrollIntoViewIfNeeded();
    await p.locator('.spot').nth(9).click();          // attaquant de pointe
    await p.waitForTimeout(300);
    await p.locator('.gbar-row').first().hover();
    await p.waitForTimeout(200);
  }},

  'scout-mobile': { w: 390, h: 900, theme: 'sombre', action: async (p) => {
    await p.locator('#recrutement').scrollIntoViewIfNeeded();
    await p.locator('.talent').first().scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
  }},

  tables: { w: 1440, h: 800, theme: 'clair', action: async (p) => {
    await p.locator('#recrutement').scrollIntoViewIfNeeded();
    await p.locator('[data-table="table-talents"]').click();
    await p.waitForTimeout(300);
    await p.locator('#table-talents').scrollIntoViewIfNeeded();
    await p.waitForTimeout(200);
  }},

  'menu-mobile': { w: 390, h: 700, theme: 'sombre', action: async (p) => {
    await p.click('#burger');
    await p.waitForTimeout(250);
  }},
};

const demandees = args.filter((a) => !a.startsWith('--'));
const inconnues = demandees.filter((v) => !(v in VUES));
if (inconnues.length) {
  console.error(`Vue inconnue : ${inconnues.join(', ')}\nDisponibles : ${Object.keys(VUES).join(', ')}`);
  process.exit(2);
}
const aRendre = demandees.length ? demandees : Object.keys(VUES);

/* ---------------------------------------------------------- exécution -- */
fs.mkdirSync(SORTIE, { recursive: true });
const url = pathToFileURL(PAGE).href;
const navigateur = await chromium.launch(NAVIGATEUR ? { executablePath: NAVIGATEUR } : {});
const incidents = [];

/* Les sections apparaissent sur IntersectionObserver : sans parcourir la page,
 * une capture pleine hauteur fige des blocs restés à opacity 0. */
async function parcourir(p) {
  await p.evaluate(async () => {
    const pas = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += pas) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(500);
}

for (const nom of aRendre) {
  const v = VUES[nom];
  const ctx = await navigateur.newContext({
    viewport: { width: v.w, height: v.h },
    deviceScaleFactor: 2,
  });
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') incidents.push(`[${nom}] ${m.type()} : ${m.text()}`);
  });
  p.on('pageerror', (e) => incidents.push(`[${nom}] erreur JS : ${e.message}`));

  await p.goto(url, { waitUntil: 'load' });
  if (v.theme === 'clair') await p.click('#theme-toggle');
  await p.waitForTimeout(900);
  if (v.entiere) await parcourir(p);
  if (v.action) await v.action(p);

  const fichier = path.join(SORTIE, `${nom}.png`);
  await p.screenshot({ path: fichier, fullPage: Boolean(v.entiere) });
  console.log(`  ${fichier}`);
  await ctx.close();
}

await navigateur.close();
console.log(incidents.length ? `\nConsole :\n${incidents.join('\n')}` : '\nConsole : rien à signaler.');
process.exit(incidents.length ? 1 : 0);
