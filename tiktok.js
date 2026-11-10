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
    if (list.length === 0) { modalList.innerHTML = '<div class="empty" style="grid-column: span 2;">Ничего
