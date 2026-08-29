// app.js — Rendu du classement (mode Pays / mode Continent) + bandeau ticker
// MVP front-end uniquement : aucune donnée réelle, aucun paiement n'est traité ici.

let mode = "pays"; // "pays" | "continent"

function getRanking() {
  if (mode === "pays") {
    return [...COUNTRIES].sort((a, b) => b.total - a.total);
  }
  const byContinent = {};
  for (const c of COUNTRIES) {
    byContinent[c.continent] = (byContinent[c.continent] || 0) + c.total;
  }
  return Object.entries(byContinent)
    .map(([continent, total]) => ({ continent, total }))
    .sort((a, b) => b.total - a.total);
}

function renderLeaderboard() {
  const ranking = getRanking();
  const max = ranking[0].total;
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  ranking.forEach((entry, i) => {
    const rank = i + 1;
    const pct = Math.round((entry.total / max) * 100);
    const label = mode === "pays" ? entry.name : entry.continent;
    const badge = mode === "pays" ? flagEmoji(entry.code) : "🌍";

    const row = document.createElement("li");
    row.className = "row" + (rank === 1 ? " row--leader" : "");
    row.innerHTML = `
      <span class="row__rank">${String(rank).padStart(2, "0")}</span>
      <span class="row__badge">${badge}</span>
      <span class="row__name">${label}</span>
      <span class="row__bar-track">
        <span class="row__bar-fill" style="width:${pct}%"></span>
      </span>
      <span class="row__total">${euros(entry.total)}</span>
    `;
    list.appendChild(row);
  });
}

function setMode(newMode) {
  mode = newMode;
  document.getElementById("btn-pays").classList.toggle("toggle--active", mode === "pays");
  document.getElementById("btn-continent").classList.toggle("toggle--active", mode === "continent");
  renderLeaderboard();
}

function renderTicker() {
  const track = document.getElementById("ticker-track");
  const items = RECENT_ACTIVITY.map((a) => {
    const c = COUNTRIES.find((c) => c.code === a.code);
    const who = a.pseudo ? `${a.pseudo} fait marquer` : "Quelqu'un fait marquer";
    return `${flagEmoji(a.code)} ${who} <strong>${c.name}</strong> +${a.amount}\u00a0€`;
  });
  // dupliqué pour un défilement continu (effet scoreboard)
  track.innerHTML = [...items, ...items].map((t) => `<span class="ticker__item">${t}</span>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-pays").addEventListener("click", () => setMode("pays"));
  document.getElementById("btn-continent").addEventListener("click", () => setMode("continent"));
  renderLeaderboard();
  renderTicker();
});
