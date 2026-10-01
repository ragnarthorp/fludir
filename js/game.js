"use strict";

// ---------- Stillingar ----------

const LEVELS = [
  { id: "a", name: "Mjög algeng", from: 1, to: 500 },
  { id: "b", name: "Algeng", from: 501, to: 2000 },
  { id: "c", name: "Miðlungs", from: 2001, to: 5000 },
  { id: "d", name: "Sjaldgæf", from: 5001, to: 8000 },
  { id: "e", name: "Mjög sjaldgæf", from: 8001, to: 99999 },
];

const MAX_POINTS = 1000;
const MIN_POINTS = 10;
const MS_PER_POINT = 4; // 1 stig dregst frá fyrir hverjar 4 ms sem orðið sést

const BEST_KEY = "ordaleikur.best.v1";

// ---------- Hjálparföll ----------

const $ = (id) => document.getElementById(id);

function normalize(s) {
  return s.normalize("NFC").trim().toLowerCase();
}

function pointsFor(ms) {
  return Math.max(MIN_POINTS, Math.round(MAX_POINTS - ms / MS_PER_POINT));
}

function formatNum(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatMs(ms) {
  return (ms / 1000).toFixed(2).replace(".", ",") + " s";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY)) || {};
  } catch {
    return {};
  }
}

function saveBest(best) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    /* ekkert */
  }
}

// ---------- Ástand ----------

const settings = { from: 1, to: 500, pos: new Set(["n", "s", "l", "a", "c"]), rounds: 10 };

const game = {
  words: [],
  index: 0,
  score: 0,
  results: [],
  phase: "idle", // idle | ready | showing | input | result
  shownAt: 0,
  elapsed: 0,
};

// ---------- Upphafsskjár ----------

function buildPool() {
  const seen = new Set();
  const pool = [];
  for (const [rank, lemma, pos] of WORDS) {
    if (rank < settings.from || rank > settings.to) continue;
    if (!settings.pos.has(pos)) continue;
    if (seen.has(lemma)) continue; // sama lemma í fleiri en einum orðflokki
    seen.add(lemma);
    pool.push({ rank, lemma, pos });
  }
  return pool;
}

function settingsKey() {
  return `${settings.from}-${settings.to}`;
}

function renderLevels() {
  const box = $("levels");
  box.innerHTML = "";
  for (const lvl of LEVELS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "level";
    btn.dataset.id = lvl.id;
    const to = Math.min(lvl.to, WORDS[WORDS.length - 1][0]);
    btn.innerHTML = `<strong>${lvl.name}</strong><span>sæti ${lvl.from}–${to}</span>`;
    btn.addEventListener("click", () => selectRange(lvl.from, to));
    box.appendChild(btn);
  }
}

function selectRange(from, to) {
  settings.from = from;
  settings.to = to;
  $("rank-from").value = from;
  $("rank-to").value = to;
  updateSetup();
}

function updateSetup() {
  for (const btn of document.querySelectorAll(".level")) {
    const lvl = LEVELS.find((l) => l.id === btn.dataset.id);
    const to = Math.min(lvl.to, WORDS[WORDS.length - 1][0]);
    btn.classList.toggle("selected", lvl.from === settings.from && to === settings.to);
  }
  const n = buildPool().length;
  const info = $("pool-info");
  info.textContent = `${formatNum(n)} orð í boði`;
  info.classList.toggle("warn", n === 0);
  $("btn-start").disabled = n === 0;
}

function readCustomRange() {
  let from = parseInt($("rank-from").value, 10) || 1;
  let to = parseInt($("rank-to").value, 10) || from;
  if (from > to) [from, to] = [to, from];
  settings.from = Math.max(1, from);
  settings.to = to;
  updateSetup();
}

// ---------- Skjáir ----------

function showScreen(name) {
  for (const s of ["setup", "game", "end"]) {
    $(`screen-${s}`).classList.toggle("hidden", s !== name);
  }
}

function showStage(name) {
  for (const s of ["ready", "word", "input", "result"]) {
    $(`stage-${s}`).classList.toggle("hidden", s !== name);
  }
  $("btn-hide").classList.toggle("hidden", name !== "word");
}

// ---------- Leikur ----------

function startGame() {
  const pool = shuffle(buildPool());
  if (!pool.length) return;
  game.words = pool.slice(0, settings.rounds);
  game.index = 0;
  game.score = 0;
  game.results = [];
  showScreen("game");
  nextRound();
}

function updateStatus() {
  $("round-label").textContent = `Orð ${game.index + 1} / ${game.words.length}`;
  $("score-label").textContent = `${formatNum(game.score)} stig`;
}

function nextRound() {
  if (game.index >= game.words.length) return endGame();
  updateStatus();
  game.phase = "ready";
  showStage("ready");
}

function showWord() {
  if (game.phase !== "ready") return;
  const w = game.words[game.index];
  $("stage-word").textContent = w.lemma;
  showStage("word");
  game.phase = "showing";
  // Klukkan fer af stað þegar orðið er raunverulega komið á skjáinn
  requestAnimationFrame(() => {
    game.shownAt = performance.now();
  });
}

function hideWord() {
  if (game.phase !== "showing") return;
  game.elapsed = performance.now() - game.shownAt;
  $("stage-word").textContent = "";
  game.phase = "input";
  showStage("input");
  const input = $("answer");
  input.value = "";
  input.focus();
}

function submitAnswer(e) {
  e.preventDefault();
  if (game.phase !== "input") return;
  const typed = $("answer").value;
  if (!typed.trim()) return;

  const w = game.words[game.index];
  const correct = normalize(typed) === normalize(w.lemma);
  const points = correct ? pointsFor(game.elapsed) : 0;
  game.score += points;
  game.results.push({ word: w, typed: typed.trim(), ms: game.elapsed, points, correct });

  $("result-verdict").textContent = correct ? `Rétt! +${points} stig` : "Rangt";
  $("result-verdict").className = "verdict " + (correct ? "ok" : "bad");
  $("result-detail").innerHTML = correct
    ? `Þú sást orðið í ${formatMs(game.elapsed)}.`
    : `Orðið var <strong>${w.lemma}</strong> – þú skrifaðir <em>${escapeHtml(typed.trim())}</em>.`;

  game.phase = "result";
  updateStatus();
  showStage("result");
}

function goNext() {
  if (game.phase !== "result") return;
  game.index++;
  nextRound();
}

function endGame() {
  game.phase = "idle";
  const correctCount = game.results.filter((r) => r.correct).length;
  $("final-score").textContent =
    `${formatNum(game.score)} stig · ${correctCount} af ${game.results.length} rétt`;

  const best = loadBest();
  const key = settingsKey();
  const prev = best[key];
  if (prev === undefined || game.score > prev) {
    best[key] = game.score;
    saveBest(best);
    $("final-best").textContent = prev === undefined ? "Fyrsti leikur á þessu bili." : `Nýtt met! (áður ${prev} stig)`;
  } else {
    $("final-best").textContent = `Met á þessu bili: ${prev} stig`;
  }

  const body = $("summary-body");
  body.innerHTML = "";
  for (const r of game.results) {
    const tr = document.createElement("tr");
    tr.className = r.correct ? "ok" : "bad";
    tr.innerHTML =
      `<td>${r.word.lemma} <small>#${r.word.rank}</small></td>` +
      `<td>${escapeHtml(r.typed)}</td>` +
      `<td>${formatMs(r.ms)}</td>` +
      `<td>${r.points}</td>`;
    body.appendChild(tr);
  }
  showScreen("end");
  $("btn-again").focus();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ---------- Lyklaborð ----------

const HIDE_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

document.addEventListener("keydown", (e) => {
  if (e.repeat) return; // haldið niðri telst ekki sem nýr ásláttur
  if (game.phase === "ready" && e.key === " ") {
    e.preventDefault();
    showWord();
  } else if (game.phase === "showing" && HIDE_KEYS.has(e.key)) {
    e.preventDefault();
    hideWord();
  } else if (game.phase === "result" && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    goNext();
  }
});

// ---------- Tengingar ----------

function init() {
  renderLevels();

  $("rank-from").addEventListener("input", readCustomRange);
  $("rank-to").addEventListener("input", readCustomRange);
  for (const cb of document.querySelectorAll(".pos input")) {
    cb.addEventListener("change", () => {
      cb.checked ? settings.pos.add(cb.value) : settings.pos.delete(cb.value);
      updateSetup();
    });
  }
  $("round-count").addEventListener("change", (e) => {
    settings.rounds = parseInt(e.target.value, 10);
  });

  $("btn-start").addEventListener("click", startGame);
  $("btn-show").addEventListener("click", showWord);
  $("btn-hide").addEventListener("click", hideWord);
  $("answer-form").addEventListener("submit", submitAnswer);
  $("btn-next").addEventListener("click", goNext);
  $("btn-quit").addEventListener("click", () => {
    game.phase = "idle";
    showScreen("setup");
  });
  $("btn-again").addEventListener("click", startGame);
  $("btn-menu").addEventListener("click", () => showScreen("setup"));

  // Á snertiskjá: að pikka á orðið felur það
  $("stage-word").addEventListener("pointerdown", hideWord);

  selectRange(LEVELS[0].from, LEVELS[0].to);
}

init();
