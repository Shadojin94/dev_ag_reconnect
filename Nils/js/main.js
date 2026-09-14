/* ==========================================================
   Dés & Merveilles — interactions de la landing page
   ========================================================== */

const PRODUCTS = [
  { id: 1, name: "Galaxie Gourmande", cat: "Stratégie", emoji: "🪐", c1: "#7c5cff", c2: "#ff4d8d", price: 34.9, rating: 4.8, reviews: 212, players: [2, 5], age: 10, time: 45, tags: ["new", "best"] },
  { id: 2, name: "Mots Mêlés Party", cat: "Ambiance", emoji: "🎤", c1: "#ff6b35", c2: "#ffc233", price: 19.9, rating: 4.7, reviews: 486, players: [3, 8], age: 8, time: 20, tags: ["best"] },
  { id: 3, name: "Empires d'Obsidienne", cat: "Experts", emoji: "🏰", c1: "#1f1b4d", c2: "#7c5cff", price: 59.9, oldPrice: 69.9, rating: 4.9, reviews: 97, players: [1, 4], age: 14, time: 120, tags: ["new"] },
  { id: 4, name: "La Forêt des Lucioles", cat: "Enfants", emoji: "🌲", c1: "#12b5a0", c2: "#5cc04a", price: 24.9, rating: 4.6, reviews: 158, players: [2, 4], age: 5, time: 15, tags: ["best"] },
  { id: 5, name: "Duel des Dragons", cat: "À deux", emoji: "🐉", c1: "#f0483e", c2: "#ff6b35", price: 22.5, rating: 4.5, reviews: 74, players: [2, 2], age: 10, time: 30, tags: ["new"] },
  { id: 6, name: "Le Manoir Hanté", cat: "Escape game", emoji: "👻", c1: "#1f1b4d", c2: "#12b5a0", price: 29.9, rating: 4.7, reviews: 0, players: [1, 6], age: 12, time: 90, tags: ["pre"], release: "Sortie le 8 oct." },
  { id: 7, name: "Sushi Express", cat: "Famille", emoji: "🍣", c1: "#ff4d8d", c2: "#ff6b35", price: 14.9, oldPrice: 17.9, rating: 4.8, reviews: 631, players: [2, 6], age: 7, time: 20, tags: ["best"] },
  { id: 8, name: "Cap'tain Tempête", cat: "Ambiance", emoji: "🏴‍☠️", c1: "#3a86ff", c2: "#12b5a0", price: 27.9, rating: 4.4, reviews: 53, players: [3, 7], age: 8, time: 30, tags: ["new"] },
  { id: 9, name: "Mystères à Minuit", cat: "Enquête solo", emoji: "🕵️", c1: "#7c5cff", c2: "#3a86ff", price: 18.9, rating: 4.6, reviews: 0, players: [1, 1], age: 14, time: 60, tags: ["pre"], release: "Sortie le 15 oct." },
  { id: 10, name: "Potion Express", cat: "Famille", emoji: "🧪", c1: "#5cc04a", c2: "#ffc233", price: 21.9, rating: 4.5, reviews: 0, players: [2, 5], age: 6, time: 25, tags: ["pre"], release: "Sortie le 22 oct." },
  { id: 11, name: "Chroniques Stellaires", cat: "Experts", emoji: "🚀", c1: "#3a86ff", c2: "#7c5cff", price: 89.9, rating: 4.9, reviews: 0, players: [1, 5], age: 14, time: 180, tags: ["pre"], release: "Sortie le 5 nov." },
  { id: 12, name: "Carrousel des Couleurs", cat: "Enfants", emoji: "🎨", c1: "#ffc233", c2: "#ff4d8d", price: 16.9, rating: 4.7, reviews: 204, players: [2, 10], age: 6, time: 15, tags: ["new", "best"] },
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const euro = (n) => n.toFixed(2).replace(".", ",") + " €";

/* ---------- Cartes produit ---------- */
function stars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + `<span class="stars__off">${"★".repeat(5 - full)}</span>`;
}

function productCard(p) {
  const isPre = p.tags.includes("pre");
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const players = p.players[0] === p.players[1] ? p.players[0] : `${p.players[0]}-${p.players[1]}`;
  const badges = [
    p.tags.includes("new") ? '<span class="badge badge--new">Nouveau</span>' : "",
    p.tags.includes("best") ? '<span class="badge badge--best">Top vente</span>' : "",
    isPre ? '<span class="badge badge--pre">Précommande</span>' : "",
    discount ? `<span class="badge badge--promo">-${discount} %</span>` : "",
  ].join("");

  return `
    <article class="card">
      <div class="card__cover" style="--c1:${p.c1};--c2:${p.c2}">
        <div class="card__badges">${badges}</div>
        <button class="card__wish" data-wish="${p.id}" aria-pressed="false" aria-label="Ajouter ${p.name} à mes envies"><svg><use href="#i-heart"/></svg></button>
        <span class="card__emoji" aria-hidden="true">${p.emoji}</span>
      </div>
      <div class="card__body">
        <span class="card__cat">${p.cat}</span>
        <h3 class="card__title">${p.name}</h3>
        <div class="card__rating">
          <span class="stars">${stars(p.rating)}</span>
          <small>${p.reviews ? `${p.rating.toString().replace(".", ",")} (${p.reviews} avis)` : "Très attendu"}</small>
        </div>
        <ul class="card__meta">
          <li><svg><use href="#i-players"/></svg>${players} j.</li>
          <li>${p.age}+ ans</li>
          <li><svg><use href="#i-clock"/></svg>${p.time} min</li>
        </ul>
        <p class="stock ${isPre ? "stock--pre" : ""}">${isPre ? p.release : "En stock · expédié sous 24h"}</p>
        <div class="card__foot">
          <div class="price"><b>${euro(p.price)}</b>${p.oldPrice ? `<s>${euro(p.oldPrice)}</s>` : ""}</div>
          <button class="add" data-add="${p.id}" aria-label="${isPre ? "Précommander" : "Ajouter au panier"} ${p.name}">
            <svg><use href="#i-cart"/></svg><span>${isPre ? "Réserver" : "Ajouter"}</span>
          </button>
        </div>
      </div>
    </article>`;
}

/* ---------- Onglets + carrousel ---------- */
const track = $("#productTrack");

function renderTab(tab) {
  track.innerHTML = PRODUCTS.filter((p) => p.tags.includes(tab)).map(productCard).join("");
  track.scrollTo({ left: 0 });
  syncWishButtons();
}

$$(".tab").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn);
    });
    renderTab(btn.dataset.tab);
  })
);

$(".carousel__btn--prev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" }));
$(".carousel__btn--next").addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" }));

/* ---------- Conseiller de jeu ---------- */
const filters = { players: "all", age: "all", time: "all" };

function matches(p) {
  const { players, age, time } = filters;
  if (players === "1" && p.players[0] > 1) return false;
  if (players === "2" && !(p.players[0] <= 2 && p.players[1] >= 2)) return false;
  if (players === "5" && p.players[1] < 5) return false;
  if (age !== "all" && p.age > Number(age)) return false;
  if (time === "20" && p.time > 20) return false;
  if (time === "45" && p.time > 45) return false;
  if (time === "999" && p.time < 60) return false;
  return true;
}

function renderFinder() {
  const results = PRODUCTS.filter(matches);
  $("#finderCount").innerHTML = results.length
    ? `<strong>${results.length}</strong> jeu${results.length > 1 ? "x" : ""} pour votre tablée 🎯`
    : "Aucun jeu ne correspond… essayez d'assouplir un critère 🤔";
  $("#finderGrid").innerHTML = results.length
    ? results.slice(0, 8).map(productCard).join("")
    : '<p class="empty">🎲 Pas de résultat pour cette combinaison.</p>';
  syncWishButtons();
}

$$(".chips").forEach((group) =>
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$(".chip", group).forEach((c) => c.classList.toggle("is-active", c === chip));
    filters[group.dataset.filter] = chip.dataset.value;
    renderFinder();
  })
);

/* ---------- Panier, envies, toast ---------- */
let cart = 0;
const wishes = new Set();
let toastTimer;

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
}

function bump(el, value) {
  el.textContent = value;
  el.classList.remove("bump");
  void el.offsetWidth; // relance l'animation
  el.classList.add("bump");
}

function syncWishButtons() {
  $$("[data-wish]").forEach((b) => {
    const on = wishes.has(Number(b.dataset.wish));
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on);
  });
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const p = PRODUCTS.find((x) => x.id === Number(add.dataset.add));
    bump($("#cartCount"), ++cart);
    add.classList.add("is-done");
    setTimeout(() => add.classList.remove("is-done"), 1200);
    toast(`🎉 « ${p.name} » ajouté au panier`);
    return;
  }

  const wish = e.target.closest("[data-wish]");
  if (wish) {
    const id = Number(wish.dataset.wish);
    const p = PRODUCTS.find((x) => x.id === id);
    wishes.has(id) ? wishes.delete(id) : wishes.add(id);
    syncWishButtons();
    bump($("#wishCount"), wishes.size);
    toast(wishes.has(id) ? `💖 « ${p.name} » ajouté à vos envies` : `« ${p.name} » retiré de vos envies`);
  }
});

/* ---------- Compte à rebours (jusqu'à dimanche minuit) ---------- */
function nextSundayMidnight() {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  d.setHours(23, 59, 59, 999);
  return d;
}

const deadline = nextSundayMidnight();
const pad = (n) => String(n).padStart(2, "0");

function tick() {
  const diff = Math.max(0, deadline - Date.now());
  const units = {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
  $$("#countdown [data-unit]").forEach((el) => (el.textContent = pad(units[el.dataset.unit])));
}
tick();
setInterval(tick, 1000);

/* ---------- Newsletter ---------- */
$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("input", e.currentTarget);
  const msg = $("#newsletterMsg");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  msg.className = "newsletter__msg " + (ok ? "is-ok" : "is-error");
  msg.textContent = ok
    ? "Bienvenue dans la guilde ! Votre code -10 % arrive par e-mail 🎁"
    : "Oups, cette adresse e-mail ne semble pas valide.";
  if (ok) input.value = "";
});

/* ---------- En-tête & menu mobile ---------- */
const header = $("#header");
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });

const burger = $("#burger");
burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") !== "true";
  burger.setAttribute("aria-expanded", open);
  $("#mainnav").classList.toggle("is-open", open);
});
$$("#mainnav a").forEach((a) =>
  a.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    $("#mainnav").classList.remove("is-open");
  })
);

/* ---------- Apparition au défilement ---------- */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  $$(".perk, .cat, .section__head, .finder, .promo, .staff, .events, .newsletter").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.animationDelay = `${(i % 4) * 60}ms`;
    observer.observe(el);
  });
}

/* ---------- Init ---------- */
renderTab("new");
renderFinder();
