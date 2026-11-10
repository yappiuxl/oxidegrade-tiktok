// ============================================================
// Oxidegrade — TikTok Demo (No Server)
// ============================================================

const AUDIO = {
  ctx: null, volume: 0.67, enabled: true,
  ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; } }
    if (this.ctx && this.ctx.state === "suspended") { this.ctx.resume(); }
    return this.ctx;
  },
  tone(freq, duration, type = "sine", vol = 1) {
    if (!this.enabled) return;
    const ctx = this.ensure(); if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    const v = this.volume * vol;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration);
  },
  click() { this.tone(800, 0.04, "square", 0.4); },
  tick() { this.tone(1200, 0.03, "square", 0.3); },
  win() {
    const ctx = this.ensure(); if (!ctx) return;
    const now = ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = f; const v = this.volume;
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(v, now + i * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.3);
    });
  },
  lose() {
    const ctx = this.ensure(); if (!ctx) return;
    const now = ctx.currentTime;
    [400, 300, 200].forEach((f, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "sawtooth"; osc.frequency.value = f; const v = this.volume * 0.7;
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(v, now + i * 0.1 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.3);
    });
  }
};
document.body.addEventListener("touchstart", () => AUDIO.ensure(), { once: true });
document.body.addEventListener("click", () => AUDIO.ensure(), { once: true });

let wheelSpeed = "normal";
try {
  const s = localStorage.getItem("voet_wheel_speed");
  if (s === "fast" || s === "normal" || s === "slow") wheelSpeed = s;
  const savedSound = localStorage.getItem("voet_sound");
  if (savedSound === "off") AUDIO.enabled = false;
} catch (e) {}

function getWheelDuration() {
  if (wheelSpeed === "fast") return 500;
  if (wheelSpeed === "slow") return 30000;
  return 8000;
}

const PLAYERS = [
  { name: "Древесина", price: 0.05, rarity: "default", no_withdraw: true, img: "древесина.png" },
  { name: "Камень", price: 0.05, rarity: "default", no_withdraw: true, img: "камень.png" },
  { name: "Уголь", price: 0.1, rarity: "default", no_withdraw: true, img: "уголь.png" },
  { name: "Металлические фрагменты", price: 0.15, rarity: "default", no_withdraw: true, img: "металлические_фрагменты.png" },
  { name: "Кость", price: 0.35, rarity: "default", no_withdraw: true },
  { name: "Металлолом", price: 0.5, rarity: "default", no_withdraw: true, img: "металлолом.png" },
  { name: "Болт", price: 0.5, rarity: "default", no_withdraw: true },
  { name: "Кожа", price: 0.6, rarity: "default", no_withdraw: true, img: "кожа.png" },
  { name: "Животный жир", price: 0.6, rarity: "default", no_withdraw: true, img: "животный_жир.png" },
  { name: "Бутылка с водой", price: 0.8, rarity: "default", no_withdraw: true },
  { name: "Сера", price: 1, rarity: "default", no_withdraw: true, img: "сера.png" },
  { name: "Ткань", price: 2, rarity: "default", no_withdraw: true, img: "ткань.png" },
  { name: "Кодовый замок", price: 5, rarity: "default", img: "кодовый_замок.png" },
  { name: "МВК", price: 5, rarity: "default", no_withdraw: true },
  { name: "Листовый металл", price: 7, rarity: "default", no_withdraw: true },
  { name: "Спальный мешок", price: 8, rarity: "default", img: "спальный_мешок.png" },
  { name: "Большой ящик для хранения", price: 8, rarity: "default", img: "большой_ящик.png" },
  { name: "Костяной шлем", price: 8, rarity: "default", img: "костяной_шлем.png" },
  { name: "Технический мусор", price: 8, rarity: "default", no_withdraw: true },
  { name: "Печь", price: 10, rarity: "default", img: "печь.png" },
  { name: "Железная дверь", price: 10, rarity: "default", img: "железная_дверь.png" },
  { name: "Арбалет", price: 12, rarity: "default", img: "арбалет.png" },
  { name: "Корпус винтовки", price: 12, rarity: "default", no_withdraw: true, img: "корпус_винтовки.png" },
  { name: "Корпус пулемёта", price: 12, rarity: "default", no_withdraw: true, img: "корпус_пулемёта.png" },
  { name: "Костяная защита ног", price: 13, rarity: "default" }, 
  { name: "Костяная обувь", price: 13, rarity: "default" },
  { name: "Ремонтный шкаф", price: 15, rarity: "default", img: "ремонтный_шкаф.png" },
  { name: "Костяной нагрудник", price: 20, rarity: "default", img: "костяной_нагрудник.png" },
  { name: "Верстак", price: 30, rarity: "default", img: "верстак.png" },
  { name: "Руку на отсичение!", price: 31, rarity: "epic", img: "руку_на_отсичение.png" },
  { name: "Ангел в слизи", price: 31, rarity: "epic", img: "ангел_в_слизи.png" },
  { name: "Камера видеонаблюдения", price: 35, rarity: "default", img: "камера_видеонаблюдения.png" },
  { name: "Компьютер наведения", price: 35, rarity: "default" }, 
  { name: "Голографический прицел", price: 75, rarity: "default", img: "голографический_прицел.png" },
  { name: "Увеличенный магазин", price: 75, rarity: "default", img: "увеличенный_магазин.png" },
  { name: "Дульный тормоз", price: 100, rarity: "default", img: "дульный_тормоз.png" },
  { name: "Компенсатор", price: 125, rarity: "default" },
  { name: "Ночной дозор", price: 131, rarity: "legendary", img: "ночной_дозор.png" },
  { name: "Страж полнокровия", price: 131, rarity: "epic", img: "страж_полнокровия.png" },
  { name: "Безголовая компания", price: 131, rarity: "epic", img: "безголовая_компания.png" },
  { name: "Обитель сновидений", price: 131, rarity: "epic", img: "обитель_сновидений.png" }
];

const RARITY_NAMES = {};

// ---------- ОБРАБОТКА КАРТИНОК (упрощенная) ----------
const _processedImages = new Map();
const _processingInFlight = new Set();
const _imgProcessFailed = new Set();
const _imgElementsCache = new Map();

function registerImgElement(img) {
  const src = img.dataset.srcOriginal;
  if (!src) return;
  if (!_imgElementsCache.has(src)) _imgElementsCache.set(src, new Set());
  _imgElementsCache.get(src).add(img);
}

function refreshImagesForSrc(src) {
  const set = _imgElementsCache.get(src);
  if (!set) return;
  for (const img of set) {
    if (!img.isConnected) { set.delete(img); continue; }
    const processed = _processedImages.get(src + "|default");
    if (processed) { img.src = processed; img.style.display = ""; }
  }
}

function getProcessedSrc(src, rarity) {
  return src; // В TikTok-версии не обрабатываем фон (чтобы не грузить телефон)
}

function playerImgTag(p, extraClass) {
  if (!p.img) {
    const cls = extraClass ? ` ${extraClass}` : "";
    return `<div class="card-img-placeholder bg-${p.rarity || 'default'}${cls}" style="width:100%; height:100%; border-radius:8px;"></div>`;
  }
  const cls = extraClass ? ` class="${extraClass}"` : "";
  return `<img src="${p.img}" data-src-original="${p.img}" data-rarity="${p.rarity || 'default'}"${cls} data-img-tag="1">`;
}

function registerNewImgTags(rootEl) {
  if (!rootEl) return;
  rootEl.querySelectorAll("img[data-img-tag]").forEach(img => {
    registerImgElement(img);
    img.removeAttribute("data-img-tag");
  });
}

function snapshotPlayer(p) {
  const s = { name: p.name, price: p.price };
  if (p.img) s.img = p.img;
  if (p.favorite) s.favorite = true;
  if (p.no_withdraw) s.no_withdraw = true;
  return s;
}

// --- СОСТОЯНИЕ (локальное) ---
const TIKTOK_SAVE_KEY = "oxidegrade_tiktok_v1";
let state = { coins: 1000, players: [] }; // Стартовый баланс 1000 для демо

function saveTikTokState() {
  try {
    localStorage.setItem(TIKTOK_SAVE_KEY, JSON.stringify({ coins: state.coins, players: state.players }));
  } catch (e) {}
}

function loadTikTokState() {
  try {
    const raw = localStorage.getItem(TIKTOK_SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.coins = typeof data.coins === "number" ? data.coins : 1000;
    state.players = Array.isArray(data.players) ? data.players : [];
  } catch (e) {}
}

// --- ОСТАЛЬНЫЕ ФУНКЦИИ (СПИН, UI) ---
// ... (я вставляю их ниже полностью, чтобы не было ошибок)

let betPlayers = []; let betCoins = 0; let upgradeTo = null; let activeQuick = null;
let collectionSort = "asc"; let spinning = false; let currentAngle = 0;
const MAX_BETS = 6;
let quickConfig = { mult: [2, 5, 10], chance: [35, 67, 80] };
function getMaxBets() { return MAX_BETS; }

function updateCoins() {
  const el = document.getElementById("coins");
  if (el) el.textContent = Math.round(state.coins * 100) / 100;
}

function removePlayerAtIndex(idx) {
  if (idx < 0 || idx >= state.players.length) return null;
  const removed = state.players.splice(idx, 1)[0];
  betPlayers = betPlayers.filter(i => i !== idx).map(i => i > idx ? i - 1 : i);
  return removed;
}

function isFavorite(player) { return player && player.favorite === true; }

function toggleFavorite(playerIdx) {
  const p = state.players[playerIdx];
  if (!p) return;
  p.favorite = !p.favorite;
  saveTikTokState();
  if (isTabActive("collection")) renderCollection();
  if (AUDIO.enabled) AUDIO.click();
}

function showToast(text, color) {
  const toast = document.createElement("div");
  toast.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#161b22;border:2px solid ${color || '#ffd700'};padding:12px 20px;border-radius:10px;color:#fff;z-index:9999;text-align:center;box-shadow:0 0 20px ${color || '#ffd700'}66;animation:slideDown 0.3s ease;max-width:90vw;`;
  toast.innerHTML = text;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 3500);
}

function showConfirm(title, text, onYes) {
  const confirmModal = document.getElementById("confirmModal");
  const confirmTitle = document.getElementById("confirmTitle");
  const confirmText = document.getElementById("confirmText");
  if (!confirmModal || !confirmTitle || !confirmText) { if (onYes) onYes(); return; }
  confirmTitle.textContent = title; confirmText.innerHTML = text;
  confirmModal.classList.remove("hidden");
  const yesBtn = document.getElementById("confirmYesBtn");
  const noBtn = document.getElementById("confirmNoBtn");
  const newYes = yesBtn.cloneNode(true); yesBtn.parentNode.replaceChild(newYes, yesBtn);
  const newNo = noBtn.cloneNode(true); noBtn.parentNode.replaceChild(newNo, noBtn);
  newYes.addEventListener("click", () => { confirmModal.classList.add("hidden"); if (onYes) onYes(); });
  newNo.addEventListener("click", () => confirmModal.classList.add("hidden"));
}

// --- СТАВКИ ---
const betSlotsEl = document.getElementById("betSlots");
function getTotalBet() {
  let sum = 0;
  for (const i of betPlayers) { if (state.players[i]) sum += state.players[i].price; }
  return sum + betCoins;
}

function renderBetSlots() {
  if (!betSlotsEl) return;
  const parts = [];
  for (let i = 0; i < MAX_BETS; i++) {
    const playerIdx = betPlayers[i];
    if (playerIdx !== undefined && state.players[playerIdx]) {
      const p = state.players[playerIdx];
      parts.push(`<div class="bet-slot" data-slot="${i}">
        ${playerImgTag(p, "slot-img")}
        <div class="pname">${p.name}</div>
        <div class="pprice">${p.price} <img src="moneta.png" style="width: 10px; height: 10px; border-radius: 50%; vertical-align: middle;"></div>
        <button class="remove" data-remove="${i}">×</button></div>`);
    } else {
      parts.push(`<div class="bet-slot empty" data-slot="${i}">+</div>`);
    }
  }
  betSlotsEl.innerHTML = parts.join("");
  registerNewImgTags(betSlotsEl);
  betSlotsEl.querySelectorAll(".bet-slot").forEach(el => {
    el.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) {
        const idx = parseInt(e.target.dataset.remove);
        betPlayers.splice(idx, 1); renderBetSlots(); refreshUpgrade(); return;
      }
      openModalForBetSlot(parseInt(el.dataset.slot));
    });
  });
  const addInput = document.getElementById("addCoinsInput");
  const addMax = document.getElementById("addCoinsMax");
  if (addInput && addMax) {
    if (betPlayers.length === 0) { addInput.disabled = true; addMax.disabled = true; betCoins = 0; addInput.value = ""; }
    else { addInput.disabled = false; addMax.disabled = false; }
  }
}

function openModalForBetSlot(slot) {
  if (state.players.length === 0) { alert("Коллекция пуста!"); return; }
  modalMode = "bet"; modalSlot = slot; modalSearchValue = ""; modalSearch.value = "";
  document.getElementById("modalTitle").textContent = "Выбери предмет для ставки";
  renderModalList(); document.getElementById("modal").classList.remove("hidden");
}

// --- МОДАЛКА ВЫБОРА ---
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalList = document.getElementById("modalList");
const modalSearch = document.getElementById("modalSearch");
let modalSearchValue = ""; let modalMode = null; let modalSlot = 0;

let _modalSearchTimer = null;
if(modalSearch) modalSearch.addEventListener("input", () => {
  modalSearchValue = modalSearch.value.toLowerCase().trim();
  clearTimeout(_modalSearchTimer);
  _modalSearchTimer = setTimeout(() => renderModalList(), 150);
});
if(document.getElementById("modalClose")) document.getElementById("modalClose").addEventListener("click", () => modal.classList.add("hidden"));

function renderModalList() {
  if (modalMode === "bet") {
    let list = state.players.map((p, i) => ({ ...p, _idx: i }));
    if (modalSearchValue) list = list.filter(p => p.name.toLowerCase().includes(modalSearchValue));
    if (list.length === 0) { modalList.innerHTML = '<div class="empty" style="grid-column: span 2;">Ничего не найдено</div>'; return; }
    modalList.innerHTML = list.map(p => `<div class="item" onclick="chooseBetPlayer(${p._idx})">
      ${playerImgTag(p, "item-img")}
      <div class="pname">${p.name}</div>
      <div class="pprice">${p.price} <img src="moneta.png" style="width: 10px; height: 10px; border-radius: 50%; vertical-align: middle;"></div></div>`).join("");
    registerNewImgTags(modalList);
  } else if (modalMode === "to") {
    const totalBet = getTotalBet(); if (totalBet <= 0) return;
    const allTargets = PLAYERS.filter(p => p.price > totalBet)
      .filter(p => !modalSearchValue || p.name.toLowerCase().includes(modalSearchValue))
      .sort((a, b) => a.price - b.price);
    if (allTargets.length === 0) { modalList.innerHTML = '<div class="empty" style="grid-column: span 2;">Ничего не найдено</div>'; return; }
    modalList.innerHTML = allTargets.map((p, i) => `<div class="item" onclick="chooseTo(${i})">${playerImgTag(p, "item-img")}<div class="pname">${p.name}</div><div class="pprice">${p.price} <img src="moneta.png" style="width: 10px; height: 10px; border-radius: 50%; vertical-align: middle;"></div></div>`).join("");
    registerNewImgTags(modalList);
    window._targets = allTargets;
  }
}

function chooseBetPlayer(idx) {
  if (betPlayers.includes(idx)) { modal.classList.add("hidden"); return; }
  const slot = modalSlot;
  if (slot < betPlayers.length) betPlayers[slot] = idx; else betPlayers.push(idx);
  if (betPlayers.length > MAX_BETS) betPlayers.length = MAX_BETS;
  if (upgradeTo && getTotalBet() >= upgradeTo.price) {
    upgradeTo = null; renderTargetBox(); alert("Сумма ставок превысила цену цели. Выбери цель заново.");
  }
  modal.classList.add("hidden"); renderBetSlots(); refreshUpgrade(); saveTikTokState();
}

function openModalForTarget() {
  if (getTotalBet() <= 0) { alert("Сначала выбери хотя бы один предмет!"); return; }
  modalMode = "to"; modalSearchValue = ""; modalSearch.value = "";
  document.getElementById("modalTitle").textContent = "Выбери цель апгрейда";
  renderModalList(); modal.classList.remove("hidden");
}

function chooseTo(i) {
  const target = window._targets[i];
  if (!target) return;
  if (getChanceForTarget(target) > 80) { alert("Нельзя делать апгрейд, если шанс > 80%!"); return; }
  upgradeTo = target; activeQuick = null;
  renderTargetBox(); modal.classList.add("hidden"); refreshUpgrade(); saveTikTokState();
}

function renderTargetBox() {
  const el = document.getElementById("targetBox");
  if (!el) return;
  if (!upgradeTo) { el.className = "target-box empty"; el.innerHTML = "Выбрать<br>цель"; return; }
  el.className = "target-box";
  el.innerHTML = `
    ${playerImgTag(upgradeTo, "target-img")}
    <div class="pname">${upgradeTo.name}</div>
    <div class="pprice">${upgradeTo.price} <img src="moneta.png" style="width: 12px; height: 12px; border-radius: 50%; vertical-align: middle;"></div>`;
  registerNewImgTags(el);
}

if(document.getElementById("targetBox")) document.getElementById("targetBox").addEventListener("click", openModalForTarget);

// --- ДОКИДЫВАНИЕ И БЫСТРЫЕ КНОПКИ ---
const addCoinsInput = document.getElementById("addCoinsInput");
if(addCoinsInput) addCoinsInput.addEventListener("input", () => {
  let v = parseFloat(addCoinsInput.value) || 0;
  if (v < 0) v = 0;
  if (v > state.coins) v = state.coins;
  betCoins = Math.round(v * 100) / 100;
  addCoinsInput.value = betCoins;
  if (upgradeTo && getTotalBet() >= upgradeTo.price) {
    upgradeTo = null; renderTargetBox(); alert("Сумма ставок превысила цену цели. Выбери цель заново.");
  }
  refreshUpgrade(); saveTikTokState();
});

if(document.getElementById("addCoinsMax")) document.getElementById("addCoinsMax").addEventListener("click", () => {
  let maxAllowed = state.coins;
  if (upgradeTo) {
    const betPlayersSum = betPlayers.reduce((s, i) => s + (state.players[i] ? state.players[i].price : 0), 0);
    const needed = (upgradeTo.price * 0.75) - betPlayersSum;
    if (needed > 0 && needed < maxAllowed) maxAllowed = Math.floor(needed * 100) / 100;
  }
  betCoins = Math.floor(maxAllowed * 100) / 100;
  addCoinsInput.value = betCoins;
  if (upgradeTo && getTotalBet() >= upgradeTo.price) {
    upgradeTo = null; renderTargetBox(); alert("Сумма ставок превысила цену цели. Выбери цель заново.");
  }
  refreshUpgrade(); saveTikTokState();
});

const quickRow = document.getElementById("quickRow");
function renderQuickRow() {
  if(!quickRow) return;
  const hasAnyBet = getTotalBet() > 0;
  const parts = [];
  parts.push(`<button class="qbtn random" id="randomTargetBtn" ${hasAnyBet ? "" : "disabled"} title="Случайная цель">🎯</button>`);
  quickConfig.mult.forEach(m => parts.push(`<button class="qbtn mult" data-mult="${m}" ${hasAnyBet ? "" : "disabled"}>×${m}</button>`));
  quickConfig.chance.forEach(c => parts.push(`<button class="qbtn chance" data-chance="${c}" ${hasAnyBet ? "" : "disabled"}>${c}%</button>`));
  parts.push(`<button class="qbtn settings" id="openSettings" title="Настройки">⚙️</button>`);
  quickRow.innerHTML = parts.join("");
  document.getElementById("randomTargetBtn").addEventListener("click", randomTarget);
  document.getElementById("openSettings").addEventListener("click", () => {
    document.getElementById("settingsBtn").click();
  });
  updateQuickButtons();
}

function randomTarget() {
  const totalBet = getTotalBet();
  if (totalBet <= 0) return;
  const candidates = PLAYERS.filter(p => p.price > totalBet);
  if (candidates.length === 0) { alert("Нет подходящей цели!"); return; }
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  if (getChanceForTarget(pick) > 80) { alert("Нельзя делать апгрейд, если шанс > 80%!"); return; }
  upgradeTo = pick; activeQuick = null;
  renderTargetBox(); updateQuickButtons(); refreshUpgrade(); saveTikTokState();
  AUDIO.click();
}

function updateQuickButtons() {
  if(!quickRow) return;
  const hasAnyBet = getTotalBet() > 0;
  quickRow.querySelectorAll("button.qbtn").forEach(btn => {
    if (btn.classList.contains("random")) { btn.disabled = !hasAnyBet; return; }
    btn.disabled = !hasAnyBet;
    const isMult = btn.classList.contains("mult");
    const val = isMult ? parseFloat(btn.dataset.mult) : parseFloat(btn.dataset.chance);
    const type = isMult ? "mult" : "chance";
    if (activeQuick && activeQuick.type === type && activeQuick.value === val) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

if(quickRow) quickRow.addEventListener("click", (e) => {
  const btn = e.target.closest("button.qbtn");
  if (!btn || btn.disabled) return;
  const totalBet = getTotalBet(); if (totalBet <= 0) return;
  const isMult = btn.classList.contains("mult"); let found = null;
  if (isMult) {
    const mult = parseFloat(btn.dataset.mult);
    found = searchByMultiplier(totalBet, mult);
    if (found) activeQuick = { type: "mult", value: mult };
  } else {
    const chance = parseFloat(btn.dataset.chance);
    found = searchByChance(totalBet, chance);
    if (found) activeQuick = { type: "chance", value: chance };
  }
  if (!found) { alert("Нет подходящей цели!"); return; }
  if (found.price <= totalBet) { alert("Цель не дороже ставки!"); return; }
  if (getChanceForTarget(found) > 80) { alert("Нельзя делать апгрейд, если шанс > 80%!"); return; }
  upgradeTo = found; renderTargetBox(); updateQuickButtons(); refreshUpgrade(); saveTikTokState();
});

function findExactTarget(targetPrice) {
  const rounded = Math.round(targetPrice);
  for (const p of PLAYERS) { if (Math.abs(p.price - rounded) <= 1) return p; }
  return null;
}
function searchByMultiplier(fromPrice, mult) {
  let found = findExactTarget(fromPrice * mult); if (found) return found;
  for (let i = 1; i * 0.01 <= 100; i++) {
    const up = mult + i * 0.01; if (up <= 10000) { found = findExactTarget(fromPrice * up); if (found) return found; }
    const down = mult - i * 0.01; if (down >= 1.5) { found = findExactTarget(fromPrice * down); if (found) return found; }
  }
  return null;
}
function searchByChance(fromPrice, chancePct) {
  const MIN = 0.01, MAX = 80;
  const c2t = ch => fromPrice * 100 / ch;
  let found = findExactTarget(c2t(chancePct)); if (found) return found;
  for (let i = 1; i <= 8000; i++) {
    const up = chancePct + i * 0.01; if (up <= MAX) { found = findExactTarget(c2t(up)); if (found) return found; }
    const down = chancePct - i * 0.01; if (down >= MIN) { found = findExactTarget(c2t(down)); if (found) return found; }
    if (up > MAX && down < MIN) break;
  }
  return null;
}

// --- ШАНС / МНОЖИТЕЛЬ ---
function getChanceForTarget(target) {
  if (!target) return null;
  const totalBet = getTotalBet();
  if (totalBet <= 0 || target.price <= totalBet) return null;
  let chance = (totalBet / target.price) * 100;
  return Math.round(chance * 100) / 100;
}
function getChance() { return getChanceForTarget(upgradeTo); }
function getMultiplier() {
  const ch = getChance();
  if (ch === null || ch === 0) return null;
  return 100 / ch;
}

function updateWheelVisual(chance) {
  const el = document.getElementById("wheelBg");
  if (!el) return;
  if (chance === null) { el.style.background = `conic-gradient(#000 0deg, #000 360deg)`; return; }
  const deg = (chance / 100) * 360;
  el.style.background = `conic-gradient(#da3633 0deg, #da3633 ${deg}deg, #000 ${deg}deg, #000 360deg)`;
}

function refreshUpgrade() {
  const btn = document.getElementById("spinUpgrade");
  const totalLine = document.getElementById("totalLine");
  if (totalLine) totalLine.textContent = Math.round(getTotalBet() * 100) / 100;
  const chance = getChance(); const mult = getMultiplier();
  const chanceBig = document.getElementById("chanceBig");
  const multBig = document.getElementById("multBig");
  if (chance === null) {
    if (chanceBig) chanceBig.textContent = "— %";
    if (multBig) multBig.textContent = "—";
    if (btn) btn.disabled = true;
    updateWheelVisual(null); updateQuickButtons(); return;
  }
  if (chanceBig) chanceBig.textContent = chance.toFixed(2) + "%";
  if (multBig) multBig.textContent = mult === null ? "—" : mult.toFixed(2) + "x";
  if (btn) btn.disabled = chance > 80;
  updateWheelVisual(chance); updateQuickButtons();
}

function spinWheelForChance(chance, outcome) {
  return new Promise((resolve) => {
    const winAngle = (chance / 100) * 360;
    let targetOffset;
    if (outcome === "win") { targetOffset = Math.random() * winAngle * 0.85 + winAngle * 0.075; }
    else { const loseAngle = 360 - winAngle; targetOffset = winAngle + (Math.random() * loseAngle * 0.85 + loseAngle * 0.075); }
    const turns = 5 + Math.floor(Math.random() * 3);
    const finalAngleDeg = targetOffset + (turns * 360);
    const startAngleDeg = currentAngle;
    const overlayBg = document.getElementById("overlayWheelBg");
    if (overlayBg) {
      const deg = winAngle;
      overlayBg.style.background = `conic-gradient(#da3633 0deg, #da3633 ${deg}deg, #000 ${deg}deg, #000 360deg)`;
    }
    const oC = document.getElementById("overlayChanceBig");
    const oM = document.getElementById("overlayMultBig");
    if (oC) oC.textContent = chance.toFixed(2) + "%";
    if (oM) oM.textContent = (100/chance).toFixed(2) + "x";
    const startTime = performance.now();
    const duration = getWheelDuration();
    spinning = true;
    const arrowEl = document.querySelector(".wheel-container .wheel-pointer");
    const overlayArrowEl = document.querySelector("#overlayWheelContainer .wheel-pointer");
    if (arrowEl) arrowEl.style.transform = `translate(-50%, -100%) rotate(${startAngleDeg}deg)`;
    if (overlayArrowEl) overlayArrowEl.style.transform = `translate(-50%, -100%) rotate(${startAngleDeg}deg)`;
    for (let i = 0; i < 20; i++) { setTimeout(() => { if (spinning) AUDIO.tick(); }, (duration / 20) * i); }
    function animate(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const currentDeg = startAngleDeg + (finalAngleDeg - startAngleDeg) * eased;
      if (arrowEl) arrowEl.style.transform = `translate(-50%, -100%) rotate(${currentDeg}deg)`;
      if (overlayArrowEl) overlayArrowEl.style.transform = `translate(-50%, -100%) rotate(${currentDeg}deg)`;
      if (t < 1) requestAnimationFrame(animate);
      else { currentAngle = finalAngleDeg % 360; spinning = false; resolve(); }
    }
    requestAnimationFrame(animate);
  });
}

// --- СПИН ---
if(document.getElementById("spinUpgrade")) document.getElementById("spinUpgrade").addEventListener("click", () => {
  if (spinning) return;
  const chance = getChance();
  if (chance === null) { showUpgradeResult("Выбери ставки и цель!", false); return; }
  if (chance > 80) { showUpgradeResult("Шанс не может быть больше 80%!", false); return; }
  const favInBet = betPlayers.map(i => state.players[i]).filter(p => p && isFavorite(p));
  if (favInBet.length > 0) {
    const favNames = favInBet.map(p => p.name).join(", ");
    showConfirm("⭐ Избранные в ставке", `В ставке есть избранный предмет: <b>${favNames}</b>. При проигрыше он будет потерян. Продолжить?`, () => { _doSpinUpgrade(chance); });
    return;
  }
  _doSpinUpgrade(chance);
});

function _doSpinUpgrade(chance) {
  let outcome = Math.random() * 100 < chance ? "win" : "lose";
  const totalBetNow = getTotalBet(); const chanceNow = getChance();
  const stakePlayersForPanel = betPlayers.map(idx => state.players[idx]).filter(Boolean);
  let stakeForPanel;
  if (stakePlayersForPanel.length === 1) stakeForPanel = stakePlayersForPanel[0];
  else if (stakePlayersForPanel.length === 0) stakeForPanel = { name: `💰 ${totalBetNow}`, price: totalBetNow };
  else { const sorted = stakePlayersForPanel.slice().sort((a, b) => b.price - a.price); stakeForPanel = { name: `${stakePlayersForPanel.length} предметов + 💰`, price: totalBetNow, img: sorted[0].img }; }
  window._currentStakeForPanel = stakeForPanel;
  window._currentStakePlayersForPanel = stakePlayersForPanel;
  openAnimOverlay();
  showGoldChainPanel(stakeForPanel, upgradeTo, chanceNow, stakePlayersForPanel);
  animTitle.textContent = "Крутим...";
  animSub.textContent = `Шанс ${chanceNow !== null ? chanceNow.toFixed(2) : "?"}%`;
  overlayWheelContainer.style.display = "flex";
  spinWheelForChance(chance, outcome).then(() => {
    overlayWheelContainer.style.display = "none";
    finishSpin(outcome, totalBetNow, chanceNow);
  });
}

async function finishSpin(outcome, totalBet, chanceUsed) {
  const target = upgradeTo; const spentCoins = betCoins; const betPlayersCopy = betPlayers.slice();
  const stakePlayersForPanel = window._currentStakePlayersForPanel || [];
  const stakeForPanel = window._currentStakeForPanel || { name: `💰 ${totalBet}`, price: totalBet };
  if (!target) { betPlayers = []; betCoins = 0; if(addCoinsInput) addCoinsInput.value = 0; upgradeTo = null; activeQuick = null; updateCoins(); renderBetSlots(); renderTargetBox(); if (isTabActive("collection")) renderCollection(); refreshUpgrade(); saveTikTokState(); return; }
  if (outcome === "win") {
    removeBetPlayersFromCollection(betPlayersCopy);
    state.coins -= spentCoins;
    state.players.push(snapshotPlayer(target));
    AUDIO.win();
    updateCoins(); renderBetSlots(); renderTargetBox();
    if (isTabActive("collection")) renderCollection();
    refreshUpgrade(); saveTikTokState();
    showGoldChainPanel(stakeForPanel, target, chanceUsed, stakePlayersForPanel);
    animTitle.textContent = "✅ Апгрейд!";
    animSub.textContent = `${stakeForPanel.name} → ${target.name}`;
    await showAnimCard(target);
    await animSleep(1400);
    closeAnimOverlay();
    return;
  }
  // LOSE
  const hasNoWithdrawItem = betPlayersCopy.some(idx => { const p = state.players[idx]; return p && p.no_withdraw === true; });
  removeBetPlayersFromCollection(betPlayersCopy);
  state.coins -= spentCoins;
  let refund = 0;
  if (totalBet >= 5) { refund = Math.round((totalBet / 100) * 100) / 100; }
  state.coins += refund;
  AUDIO.lose();
  betPlayers = []; betCoins = 0; if(addCoinsInput) addCoinsInput.value = 0; upgradeTo = null; activeQuick = null;
  updateCoins(); renderBetSlots(); renderTargetBox();
  if (isTabActive("collection")) renderCollection();
  refreshUpgrade(); saveTikTokState();
  showGoldChainPanel(stakeForPanel, target, chanceUsed, stakePlayersForPanel);
  animTitle.textContent = "💥 Проигрыш";
  if (hasNoWithdrawItem) { animSub.textContent = "Ресурсы не дают утешительный приз"; await animSleep(1800); closeAnimOverlay(); return; }
  if (refund > 0) { animSub.innerHTML = `Утешение: +${refund} <img src="moneta.png" style="width: 14px; height: 14px; border-radius: 50%; vertical-align: middle;">`; }
  else { animSub.textContent = "Ставка слишком мала для утешения (мин. 5)"; }
  await animSleep(1800);
  closeAnimOverlay();
}

// --- АНИМАЦИИ ---
const upgradeAnimOverlay = document.getElementById("upgradeAnimOverlay");
const animCardWrap = document.getElementById("animCardWrap");
const animTitle = document.getElementById("animTitle");
const animSub = document.getElementById("animSub");
const overlayWheelContainer = document.getElementById("overlayWheelContainer");

function animSleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildAnimCard(player) {
  const card = document.createElement("div");
  card.className = "animCard"; card.style.background = "#161b22"; card.style.borderColor = "#30363d";
  card.innerHTML = `
    <div class="card-img-wrap" style="background:#0d1117;">${playerImgTag(player, "card-img")}</div>
    <div class="nameBar">
      <div class="pname">${player.name}</div>
      <div class="pprice">${player.price} <img src="moneta.png" style="width: 14px; height: 14px; border-radius: 50%; vertical-align: middle;"></div>
    </div>
  `;
  return card;
}

function showAnimCard(player) {
  return new Promise(resolve => {
    animCardWrap.style.display = "block"; animCardWrap.innerHTML = "";
    const card = buildAnimCard(player);
    card.classList.add("animCard-in");
    animCardWrap.appendChild(card);
    registerNewImgTags(animCardWrap);
    setTimeout(() => { resolve(card); }, 550);
  });
}

function openAnimOverlay() {
  if(upgradeAnimOverlay) upgradeAnimOverlay.classList.add("show");
  if(animTitle) animTitle.textContent = ""; if(animSub) animSub.textContent = "";
  if(animCardWrap) { animCardWrap.innerHTML = ""; animCardWrap.style.display = "none"; }
}
function closeAnimOverlay() {
  if(upgradeAnimOverlay) upgradeAnimOverlay.classList.remove("show");
  if(animCardWrap) animCardWrap.innerHTML = "";
  hideGoldChainPanel();
  if(overlayWheelContainer) overlayWheelContainer.style.display = "none";
}

const goldChainPanel = document.getElementById("goldChainPanel");
const gcStakeImg = document.getElementById("gcStakeImg");
const gcStakeName = document.getElementById("gcStakeName");
const gcStakePrice = document.getElementById("gcStakePrice");
const gcTargetImg = document.getElementById("gcTargetImg");
const gcTargetName = document.getElementById("gcTargetName");
const gcTargetPrice = document.getElementById("gcTargetPrice");
const gcArrowChance = document.getElementById("gcArrowChance");

function fillGcBox(imgEl, nameEl, priceEl, player) {
  if(!imgEl) return;
  if (player.img) { imgEl.innerHTML = `<img src="${player.img}" data-src-original="${player.img}" data-img-tag="1" alt="">`; }
  else { imgEl.innerHTML = `<div class="gc-letter">${player.name[0]}</div>`; }
  nameEl.textContent = player.name;
  priceEl.innerHTML = player.price + " <img src=\"moneta.png\" style=\"width: 12px; height: 12px; border-radius: 50%; vertical-align: middle;\">";
}
function fillGcStakeBox(imgEl, nameEl, priceEl, players) {
  if (players.length === 1) { fillGcBox(imgEl, nameEl, priceEl, players[0]); return; }
  const stackHtml = players.map(p => {
    if (p.img) return `<img src="${p.img}" data-src-original="${p.img}" data-img-tag="1" alt="">`;
    return `<div class="gc-letter">${p.name[0]}</div>`;
  }).join("");
  imgEl.innerHTML = `<div class="gc-stack">${stackHtml}</div><div class="gc-stack-note">${players.length} предметов</div>`;
  nameEl.textContent = "Ставка";
  priceEl.textContent = players.reduce((s, p) => s + p.price, 0) + " 💰";
}
function showGoldChainPanel(stake, target, chancePct, stakePlayers) {
  if(!goldChainPanel) return;
  if (stakePlayers && Array.isArray(stakePlayers) && stakePlayers.length > 0) fillGcStakeBox(gcStakeImg, gcStakeName, gcStakePrice, stakePlayers);
  else fillGcBox(gcStakeImg, gcStakeName, gcStakePrice, stake);
  fillGcBox(gcTargetImg, gcTargetName, gcTargetPrice, target);
  gcArrowChance.textContent = (chancePct !== null && chancePct !== undefined) ? (chancePct.toFixed(2) + "%") : "—";
  registerNewImgTags(goldChainPanel);
  goldChainPanel.classList.add("show");
}
function hideGoldChainPanel() { if(goldChainPanel) goldChainPanel.classList.remove("show"); }

function removeBetPlayersFromCollection(indices) {
  const sorted = indices.slice().sort((a, b) => b - a);
  for (const i of sorted) { const p = state.players[i]; if (!p) continue; removePlayerAtIndex(i); }
}

function showUpgradeResult(text, win) {
  const el = document.getElementById("upgradeResult");
  if (!el) return;
  el.textContent = text;
  el.className = "result " + (win ? "win" : "lose");
}

// --- МАГАЗИН ---
let marketSearchValue = "";
let _marketSearchTimer = null;
if(document.getElementById("marketSearch")) document.getElementById("marketSearch").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase().trim();
  clearTimeout(_marketSearchTimer);
  _marketSearchTimer = setTimeout(() => { marketSearchValue = val; renderMarket(); }, 200);
});

function renderMarket() {
  if (!isTabActive("market")) return;
  const el = document.getElementById("marketList");
  if (!el) return;
  let list = PLAYERS;
  if (marketSearchValue) list = list.filter(p => p.name.toLowerCase().includes(marketSearchValue));
  if (list.length === 0) { el.innerHTML = '<div class="empty" style="grid-column: span 3; text-align: center; padding: 20px;">Ничего не найдено</div>'; return; }
  el.innerHTML = list.map((p) => {
    const canAfford = state.coins >= p.price; const idx = PLAYERS.indexOf(p);
    return `
      <div class="market-item">
        <div class="card-img-wrap" style="background:#161b22;">${playerImgTag(p, "card-img")}</div>
        <div class="card-info">
          <div class="name">${p.name}</div>
          <div class="price" style="margin-top:5px;">${p.price} <img src="moneta.png" style="width: 12px; height: 12px; border-radius: 50%; vertical-align: middle;"></div>
        </div>
        <button ${canAfford ? "" : "disabled"} onclick="buyPlayer(${idx})">${canAfford ? "Купить" : "Мало монет"}</button>
      </div>`;
  }).join("");
  registerNewImgTags(el);
}

function buyPlayer(idx) {
  const p = PLAYERS[idx]; if (!p) return;
  if (state.coins < p.price) { alert("Недостаточно монет!"); return; }
  AUDIO.click(); state.coins -= p.price; state.players.push(snapshotPlayer(p));
  updateCoins(); if (isTabActive("collection")) renderCollection(); if (isTabActive("market")) renderMarket(); saveTikTokState();
}

// --- КОЛЛЕКЦИЯ ---
let collectionSearchValue = ""; let favFilterActive = false;
let _collectionSearchTimer = null;
if(document.getElementById("collectionSearch")) document.getElementById("collectionSearch").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase().trim();
  clearTimeout(_collectionSearchTimer);
  _collectionSearchTimer = setTimeout(() => { collectionSearchValue = val; renderCollection(); }, 200);
});

function renderCollection() {
  if (!isTabActive("collection")) return;
  const el = document.getElementById("collection");
  if(!el) return;
  let list = state.players.map((p, i) => ({ ...p, _idx: i }));
  if (collectionSearchValue) list = list.filter(p => p.name.toLowerCase().includes(collectionSearchValue));
  if (favFilterActive) list = list.filter(p => p.favorite === true);
  if (collectionSort === "asc") list.sort((a, b) => a.price - b.price); else list.sort((a, b) => b.price - a.price);
  if (list.length === 0) { el.innerHTML = '<div class="empty" style="grid-column: span 2;">Пусто. Купи предмет в магазине!</div>'; return; }
  el.innerHTML = list.map((p) => {
    const fav = isFavorite(p);
    return `
      <div class="player-card">
        <div class="fav-star ${fav ? 'active' : ''}" data-fav="${p._idx}">${fav ? '★' : '☆'}</div>
        <div class="card-img-wrap" style="background:#161b22;">${playerImgTag(p, "card-img")}</div>
        <div class="card-info">
          <div class="name">${p.name}</div>
          <div class="price" style="margin-top:5px;">${p.price} <img src="moneta.png" style="width: 12px; height: 12px; border-radius: 50%; vertical-align: middle;"></div>
        </div>
        <button onclick="openItemActionModal(${p._idx})">Действие</button>
      </div>`;
  }).join("");
  registerNewImgTags(el);
  el.querySelectorAll(".fav-star").forEach(star => {
    star.addEventListener("click", (e) => { e.stopPropagation(); toggleFavorite(parseInt(star.dataset.fav)); });
  });
}

let _currentTab = "upgrade";
function isTabActive(name) { return _currentTab === name; }

window.chooseBetPlayer = chooseBetPlayer;
window.chooseTo = chooseTo;
window.buyPlayer = buyPlayer;

// --- МОДАЛКА ДЕЙСТВИЙ ---
let _currentItemActionIdx = null;
function openItemActionModal(playerIdx) {
  if (spinning) return;
  const p = state.players[playerIdx]; if (!p) return;
  _currentItemActionIdx = playerIdx;
  const infoEl = document.getElementById("itemActionInfo");
  infoEl.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:center; gap:15px; background:#1a1a1a; padding:15px; border-radius:8px;">
      <div style="width:60px; height:60px;">${playerImgTag(p, "card-img")}</div>
      <div style="text-align:left;">
        <div style="color:#fff; font-weight:bold; font-size:16px;">${p.name}</div>
        <div style="color:#ffd700; font-weight:bold; font-size:14px;">${p.price} <img src="moneta.png" style="width:14px;height:14px;border-radius:50%;vertical-align:middle;"></div>
      </div>
    </div>`;
  registerNewImgTags(infoEl);
  const withdrawBtn = document.getElementById("itemActionWithdrawBtn");
  if (withdrawBtn) withdrawBtn.style.display = "none";
  document.getElementById("itemActionModal").classList.remove("hidden");
}
if(document.getElementById("itemActionClose")) document.getElementById("itemActionClose").addEventListener("click", () => { document.getElementById("itemActionModal").classList.add("hidden"); _currentItemActionIdx = null; });
if(document.getElementById("itemActionSellBtn")) document.getElementById("itemActionSellBtn").addEventListener("click", () => {
  if (_currentItemActionIdx === null) return;
  const p = state.players[_currentItemActionIdx]; if (!p) return;
  document.getElementById("itemActionModal").classList.add("hidden");
  removePlayerAtIndex(_currentItemActionIdx);
  state.coins += p.price;
  updateCoins(); saveTikTokState();
  if (isTabActive("collection")) renderCollection();
  renderBetSlots(); refreshUpgrade();
  _currentItemActionIdx = null;
});

// --- МОДАЛКА ВИРТУАЛЬНОГО БАЛАНСА ---
if (document.getElementById("rewardBtn")) {
  document.getElementById("rewardBtn").addEventListener("click", () => document.getElementById("tiktokBalanceModal").classList.remove("hidden"));
}
if (document.getElementById("tiktokBalanceClose")) {
  document.getElementById("tiktokBalanceClose").addEventListener("click", () => document.getElementById("tiktokBalanceModal").classList.add("hidden"));
}
if (document.getElementById("tiktokBalanceSet")) {
  document.getElementById("tiktokBalanceSet").addEventListener("click", () => {
    const val = parseFloat(document.getElementById("tiktokBalanceInput").value);
    if (!val || val <= 0) { alert("Введи сумму больше 0"); return; }
    state.coins += val;
    updateCoins(); saveTikTokState();
    document.getElementById("tiktokBalanceModal").classList.add("hidden");
    showToast(`Баланс пополнен на ${val} (виртуально)`, "#3fb950");
  });
}

// --- НАСТРОЙКИ ---
const settingsModal = document.getElementById("settingsModal");
if (document.getElementById("settingsBtn")) {
  document.getElementById("settingsBtn").addEventListener("click", () => {
    document.getElementById("mult1").value = quickConfig.mult[0];
    document.getElementById("mult2").value = quickConfig.mult[1];
    document.getElementById("mult3").value = quickConfig.mult[2];
    document.getElementById("chance1").value = quickConfig.chance[0];
    document.getElementById("chance2").value = quickConfig.chance[1];
    document.getElementById("chance3").value = quickConfig.chance[2];
    settingsModal.classList.remove("hidden");
  });
}
if (document.getElementById("settingsClose")) document.getElementById("settingsClose").addEventListener("click", () => settingsModal.classList.add("hidden"));
if (document.getElementById("settingsSave")) {
  document.getElementById("settingsSave").addEventListener("click", () => {
    const m1 = parseFloat(document.getElementById("mult1").value);
    const m2 = parseFloat(document.getElementById("mult2").value);
    const m3 = parseFloat(document.getElementById("mult3").value);
    const c1 = parseFloat(document.getElementById("chance1").value);
    const c2 = parseFloat(document.getElementById("chance2").value);
    const c3 = parseFloat(document.getElementById("chance3").value);
    if (m1 > 0 && m2 > 0 && m3 > 0 && c1 > 0 && c2 > 0 && c3 > 0) {
      quickConfig.mult = [m1, m2, m3];
      quickConfig.chance = [c1, c2, c3];
      renderQuickRow();
      settingsModal.classList.add("hidden");
    } else { alert("Заполните все поля положительными числами"); }
  });
}
if (document.getElementById("settingsReset")) {
  document.getElementById("settingsReset").addEventListener("click", () => {
    quickConfig = { mult: [2, 5, 10], chance: [35, 67, 80] };
    renderQuickRow();
    settingsModal.classList.add("hidden");
  });
}

// --- ТАБЫ ---
document.querySelectorAll(".bottom-nav .nav-item[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".bottom-nav .nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll("[id^='tab-']").forEach(p => p.classList.add("hidden"));
    const panel = document.getElementById("tab-" + btn.dataset.tab);
    if (panel) panel.classList.remove("hidden");
    _currentTab = btn.dataset.tab;
    if (btn.dataset.tab === "collection") renderCollection();
    if (btn.dataset.tab === "market") renderMarket();
  });
});

// --- ИНИЦИАЛИЗАЦИЯ ---
function initGameUI() {
  loadTikTokState();
  updateCoins();
  renderCollection();
  renderMarket();
  renderBetSlots();
  renderTargetBox();
  renderQuickRow();
  refreshUpgrade();
}

let loadingPct = 0;
const pctEl = document.getElementById("loadingPercent");
const lsEl = document.getElementById("loadingScreen");
const loadInterval = setInterval(() => {
  loadingPct += Math.floor(Math.random() * 15) + 5;
  if (loadingPct > 100) loadingPct = 100;
  if (pctEl) pctEl.textContent = loadingPct + "%";
  if (loadingPct === 100) {
    clearInterval(loadInterval);
    setTimeout(() => { if (lsEl) { lsEl.style.opacity = "0"; setTimeout(() => lsEl.remove(), 500); } }, 400);
  }
}, 150);

window.addEventListener("DOMContentLoaded", () => {
  initGameUI();
});
