// data.js — Données factices (à remplacer par un appel API / Stripe + base de données)
// Chaque entrée = un pays. "code" = code ISO 2 lettres (sert à générer le drapeau emoji).

const COUNTRIES = [
  { code: "FR", name: "France", continent: "Europe", total: 4820 },
  { code: "ES", name: "Espagne", continent: "Europe", total: 4310 },
  { code: "DE", name: "Allemagne", continent: "Europe", total: 3960 },
  { code: "IT", name: "Italie", continent: "Europe", total: 3105 },
  { code: "PT", name: "Portugal", continent: "Europe", total: 1870 },
  { code: "BE", name: "Belgique", continent: "Europe", total: 1640 },
  { code: "GB", name: "Royaume-Uni", continent: "Europe", total: 2230 },
  { code: "US", name: "États-Unis", continent: "Amérique du Nord", total: 5290 },
  { code: "CA", name: "Canada", continent: "Amérique du Nord", total: 1420 },
  { code: "MX", name: "Mexique", continent: "Amérique du Nord", total: 1180 },
  { code: "BR", name: "Brésil", continent: "Amérique du Sud", total: 2670 },
  { code: "AR", name: "Argentine", continent: "Amérique du Sud", total: 2510 },
  { code: "MA", name: "Maroc", continent: "Afrique", total: 1990 },
  { code: "SN", name: "Sénégal", continent: "Afrique", total: 980 },
  { code: "JP", name: "Japon", continent: "Asie", total: 1750 },
  { code: "KR", name: "Corée du Sud", continent: "Asie", total: 1340 },
];

// Derniers "votes" pour le bandeau ticker en direct (mock)
// "pseudo" est facultatif : quand il est absent, le ticker reste anonyme (juste le pays)
const RECENT_ACTIVITY = [
  { code: "FR", amount: 5, secondsAgo: 8, pseudo: "Julien93" },
  { code: "ES", amount: 20, secondsAgo: 34, pseudo: null },
  { code: "BR", amount: 5, secondsAgo: 61, pseudo: "Marina" },
  { code: "DE", amount: 10, secondsAgo: 95, pseudo: null },
  { code: "AR", amount: 5, secondsAgo: 140, pseudo: "Leo_Buenos" },
  { code: "MA", amount: 15, secondsAgo: 180, pseudo: null },
];

// Convertit un code pays ISO2 en emoji drapeau (FR -> 🇫🇷)
function flagEmoji(code) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function euros(n) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}
