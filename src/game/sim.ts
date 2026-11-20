import { ITEMS, formatCredits, itemById } from "@/game/catalog";
import { playBuy, playCollect, playKill, playLaunch, playReforge, playShot } from "@/game/audio";

export type Toast = { id: number; text: string; life: number };

export type Craft = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  steer: number;
};

export type Raider = { x: number; y: number; z: number; seed: number; alive: boolean };

export type Shot = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
};

const SAVE_KEY = "voidforge-save-v1";
const SAVE_VERSION = 1;

export const RAIDERS: Raider[] = Array.from({ length: 10 }, (_, i) => ({
  x: 0,
  y: 0,
  z: 0,
  seed: i * 1.37 + 0.4,
  alive: true,
}));

export const SHOTS: Shot[] = Array.from({ length: 32 }, () => ({
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  life: 0,
}));

export const touch = { left: false, right: false, thrust: false, fire: false };

type Mode = "build" | "sortie";

export const sim = {
  playing: false,
  mode: "build" as Mode,
  credits: 40,
  vault: 0,
  owned: new Set<string>(),
  reforges: 0,
  lifetime: 0,
  kills: 0,
  bestSortie: 0,
  redeemed: new Set<string>(),
  doubleUntil: 0,
  hinted: false,
  time: 0,
  vaultWarned: false,
  shake: 0,
  pulse: 0,
  fireCd: 0,
  fireLatch: false,
  sortieT: 0,
  sortieKills: 0,
  sortieEarnings: 0,
  sortieCleared: false,
  wave: 7,
  viewError: "",
  craft: { x: 0, y: 2.2, z: 16, yaw: 0, speed: 0, steer: 0 } as Craft,
  toasts: [] as Toast[],
  uiAcc: 0,
};

const listeners = new Set<() => void>();
const keys = new Set<string>();
let keyOverride: Set<string> | null = null;
let steerOverride: number | null = null;
let loaded = false;
let toastSeq = 1;
let saveTimer = 0;

export function subscribeUI(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function pushUI(): void {
  for (const fn of listeners) fn();
}

export function has(id: string): boolean {
  return sim.owned.has(id);
}

export function citadelPercent(): number {
  return Math.round((sim.owned.size / ITEMS.length) * 100);
}

export function vaultCap(): number {
  return (70 + sim.owned.size * 110) * (1 + sim.reforges * 0.4);
}

export function forgeMark(): number {
  return 1 + sim.reforges * 0.5;
}

export function incomePerSec(): number {
  let add = 0;
  let mult = forgeMark();
  for (const item of ITEMS) {
    if (!sim.owned.has(item.id)) continue;
    add += item.income;
    if (item.mult) mult *= item.mult;
  }
  if (Date.now() < sim.doubleUntil) mult *= 2;
  return add * mult;
}

export function itemState(id: string): "owned" | "next" | "locked" {
  const index = ITEMS.findIndex((item) => item.id === id);
  if (index < 0) return "locked";
  if (sim.owned.has(id)) return "owned";
  if (index === 0 || sim.owned.has(ITEMS[index - 1].id)) return "next";
  return "locked";
}

export function canReforge(): boolean {
  return sim.owned.has("reactor");
}

export function skiffName(): string {
  if (sim.owned.has("bay")) return "Lancewing";
  if (sim.owned.has("dock")) return "Interceptor";
  return "Haul skiff";
}

function toast(text: string): void {
  sim.toasts.unshift({ id: toastSeq++, text, life: 3.4 });
  if (sim.toasts.length > 3) sim.toasts.length = 3;
  pushUI();
}

function held(code: string): boolean {
  if (typeof window !== "undefined" && window.__vfKeys?.length) return window.__vfKeys.includes(code);
  if (keyOverride) return keyOverride.has(code);
  return keys.has(code);
}

function killReward(): number {
  const inc = Math.max(incomePerSec(), 4);
  const gear = sim.owned.has("bay") ? 2.3 : sim.owned.has("dock") ? 1.55 : 1;
  return Math.max(40, inc * 5.5) * gear;
}

function destroyRaider(raider: Raider): void {
  if (!raider.alive || sim.mode !== "sortie") return;
  raider.alive = false;
  const pay = killReward();
  sim.credits += pay;
  sim.lifetime += pay;
  sim.kills += 1;
  sim.sortieKills += 1;
  sim.sortieEarnings += pay;
  if (sim.sortieKills > sim.bestSortie) sim.bestSortie = sim.sortieKills;
  sim.shake = Math.min(1, sim.shake + 0.45);
  playKill();
  toast(`Raider broken · +${formatCredits(pay)}`);
  let left = 0;
  for (let i = 0; i < sim.wave; i += 1) if (RAIDERS[i].alive) left += 1;
  if (left === 0 && !sim.sortieCleared) {
    sim.sortieCleared = true;
    const bonus = killReward() * 4;
    sim.credits += bonus;
    sim.lifetime += bonus;
    sim.sortieEarnings += bonus;
    sim.sortieT = Math.min(sim.sortieT, 3);
    toast(`Belt clear · bonus +${formatCredits(bonus)}`);
  }
}

function spawnShot(fx: number, fz: number): void {
  const shot = SHOTS.find((entry) => entry.life <= 0);
  if (!shot) return;
  const craft = sim.craft;
  shot.life = 1.3;
  shot.x = craft.x + fx * 1.25;
  shot.y = craft.y;
  shot.z = craft.z + fz * 1.25;
  const speed = 42;
  shot.vx = fx * speed;
  shot.vy = 0;
  shot.vz = fz * speed;
  playShot();
}

export function tapFire(): void {
  if (sim.mode === "sortie") sim.fireLatch = true;
}

function stepCraft(dt: number): void {
  const craft = sim.craft;
  let steer = 0;
  // Chase cam: A must increase yaw so the nose goes left on screen.
  // forward = (-sin(yaw), 0, -cos(yaw)); +yaw turns toward world -X (screen left).
  if (held("KeyA") || held("ArrowLeft") || touch.left) steer += 1;
  if (held("KeyD") || held("ArrowRight") || touch.right) steer -= 1;
  if (steerOverride !== null) steer = steerOverride;
  if (typeof window !== "undefined" && typeof window.__vfSteer === "number") steer = window.__vfSteer;
  const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
  const pad = pads ? pads[0] : null;
  if (pad && !keyOverride && steerOverride === null) {
    const axis = pad.axes[0] ?? 0;
    if (Math.abs(axis) > 0.18) steer += -axis;
  }
  steer = Math.max(-1, Math.min(1, steer));
  craft.steer = steer;
  craft.yaw += steer * 2.4 * dt;

  let throttle = 0;
  if (held("KeyW") || held("ArrowUp") || touch.thrust) throttle += 1;
  if (held("KeyS") || held("ArrowDown")) throttle -= 0.6;
  if (pad && !keyOverride) {
    const axisY = pad.axes[1] ?? 0;
    if (axisY < -0.28 || pad.buttons[7]?.pressed) throttle += 1;
    if (pad.buttons[6]?.pressed) throttle -= 0.6;
    if (pad.buttons[0]?.pressed) sim.fireLatch = true;
  }
  throttle = Math.max(-0.6, Math.min(1, throttle));
  const target = throttle * 26;
  craft.speed += (target - craft.speed) * (1 - Math.exp(-3.4 * dt));

  const fx = -Math.sin(craft.yaw);
  const fz = -Math.cos(craft.yaw);
  craft.x += fx * craft.speed * dt;
  craft.z += fz * craft.speed * dt;
  craft.y = 2.1 + Math.sin(sim.time * 1.6) * 0.12;
  const radius = Math.hypot(craft.x, craft.z);
  if (radius > 36) {
    craft.x *= 36 / radius;
    craft.z *= 36 / radius;
  }

  sim.fireCd -= dt;
  const want = held("Space") || touch.fire || sim.fireLatch;
  if (want && sim.fireCd <= 0) {
    sim.fireCd = 0.15;
    sim.fireLatch = false;
    spawnShot(fx, fz);
  }

  for (const raider of RAIDERS) {
    if (!raider.alive) continue;
    const dx = craft.x - raider.x;
    const dy = craft.y - raider.y;
    const dz = craft.z - raider.z;
    if (dx * dx + dy * dy + dz * dz < 3.4) {
      destroyRaider(raider);
      craft.speed *= 0.3;
      sim.shake = Math.min(1, sim.shake + 0.55);
    }
  }
}

function stepShots(dt: number): void {
  for (const shot of SHOTS) {
    if (shot.life <= 0) continue;
    shot.life -= dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.z += shot.vz * dt;
    if (sim.mode !== "sortie" || shot.life <= 0) continue;
    for (let i = 0; i < sim.wave; i += 1) {
      const raider = RAIDERS[i];
      if (!raider.alive) continue;
      const dx = shot.x - raider.x;
      const dy = shot.y - raider.y;
      const dz = shot.z - raider.z;
      if (dx * dx + dy * dy + dz * dz < 2.6) {
        shot.life = 0;
        destroyRaider(raider);
        break;
      }
    }
  }
}

function placeRaiders(): void {
  const ambient = sim.mode !== "sortie";
  for (let i = 0; i < RAIDERS.length; i += 1) {
    const raider = RAIDERS[i];
    if (ambient) raider.alive = i < 7;
    if (!raider.alive) continue;
    const angle = sim.time * (0.17 + (i % 5) * 0.025) + raider.seed;
    const radius = 7 + (i % 4) * 1.65 + (ambient ? 1.4 : 0);
    raider.x = Math.cos(angle) * radius;
    raider.z = Math.sin(angle) * radius;
    raider.y = (i % 3) - 1 + Math.sin(sim.time * 0.8 + raider.seed) * 0.45;
  }
}

function beginSortie(fromProbe: boolean, preserve = false): void {
  const yaw = sim.craft.yaw;
  const speed = sim.craft.speed;
  sim.mode = "sortie";
  sim.playing = true;
  sim.sortieT = 50;
  sim.sortieKills = 0;
  sim.sortieEarnings = 0;
  sim.sortieCleared = false;
  sim.wave = sim.owned.has("bay") ? 10 : 7;
  sim.fireCd = 0.2;
  sim.fireLatch = false;
  if (!preserve) {
    sim.craft.x = 0;
    sim.craft.y = 2.2;
    sim.craft.z = 16;
    sim.craft.yaw = 0;
    sim.craft.speed = fromProbe ? 0 : 9;
    sim.craft.steer = 0;
  } else {
    sim.craft.yaw = yaw;
    sim.craft.speed = speed;
  }
  for (let i = 0; i < RAIDERS.length; i += 1) RAIDERS[i].alive = i < sim.wave;
  for (const shot of SHOTS) shot.life = 0;
  if (!fromProbe) {
    toast(`${skiffName()} launched. Break the raiders.`);
    playLaunch();
    pushUI();
    saveSoon();
  }
}

export function endSortie(reason: string): void {
  if (sim.mode !== "sortie") return;
  sim.mode = "build";
  touch.left = false;
  touch.right = false;
  touch.thrust = false;
  touch.fire = false;
  const line =
    sim.sortieKills > 0
      ? `${reason} ${sim.sortieKills} kills · +${formatCredits(sim.sortieEarnings)}`
      : reason;
  toast(line);
  pushUI();
  saveSoon();
}

export function toggleSortie(): void {
  ensureLoaded();
  sim.playing = true;
  if (!sim.hinted) sim.hinted = true;
  if (sim.mode === "sortie") endSortie("Docked.");
  else beginSortie(false);
}

export function buy(id: string): void {
  const item = itemById(id);
  if (!item) return;
  if (sim.owned.has(id)) return;
  const state = itemState(id);
  if (state === "locked") {
    toast("Build the previous module first.");
    return;
  }
  if (sim.credits + 1e-6 < item.cost) {
    toast(`Need ${formatCredits(item.cost - sim.credits)} more.`);
    return;
  }
  sim.credits -= item.cost;
  sim.owned.add(id);
  sim.shake = Math.min(1, sim.shake + 0.3);
  sim.pulse = 1;
  playBuy();
  toast(`${item.name} online.`);
  if (sim.owned.size === ITEMS.length) toast("Citadel complete. Reforge to raise the mark.");
  pushUI();
  saveSoon();
}

export function collect(): void {
  if (sim.owned.has("siphon")) return;
  if (sim.vault < 1) {
    toast("Vault is empty.");
    return;
  }
  const gained = sim.vault;
  sim.credits += gained;
  sim.lifetime += gained;
  sim.vault = 0;
  sim.pulse = 1;
  sim.vaultWarned = false;
  playCollect();
  pushUI();
  saveSoon();
}

export function reforge(): void {
  if (!canReforge()) {
    toast("Bring the amber reactor online before a reforge.");
    return;
  }
  sim.reforges += 1;
  sim.credits = 120 * sim.reforges;
  sim.vault = 0;
  sim.owned = new Set();
  sim.mode = "build";
  sim.doubleUntil = 0;
  sim.vaultWarned = false;
  playReforge();
  toast(`Reforged. Yield mark ×${sim.reforges}. Credits reset with a stipend.`);
  pushUI();
  saveNow();
}

export function redeem(code: string): void {
  const key = code.trim().toUpperCase();
  if (key === "SLAG") {
    if (sim.redeemed.has(key)) {
      toast("SLAG already used.");
      return;
    }
    sim.redeemed.add(key);
    sim.credits += 500;
    toast("Slag stipend: +500.");
  } else if (key === "KILN") {
    if (sim.redeemed.has(key)) {
      toast("KILN already used.");
      return;
    }
    sim.redeemed.add(key);
    sim.doubleUntil = Date.now() + 90_000;
    toast("Kiln surge: double yield for 90 seconds.");
  } else if (key === "ORBIT") {
    if (sim.reforges < 1) {
      toast("Reforge once, then redeem ORBIT.");
      return;
    }
    if (sim.redeemed.has(key)) {
      toast("ORBIT already used.");
      return;
    }
    sim.redeemed.add(key);
    sim.credits += 5000;
    toast("Orbit dividend: +5,000.");
  } else {
    toast("Unknown frequency.");
    return;
  }
  pushUI();
  saveSoon();
}

export function resetAll(): void {
  sim.playing = false;
  sim.mode = "build";
  sim.credits = 40;
  sim.vault = 0;
  sim.owned = new Set();
  sim.reforges = 0;
  sim.lifetime = 0;
  sim.kills = 0;
  sim.bestSortie = 0;
  sim.redeemed = new Set();
  sim.doubleUntil = 0;
  sim.hinted = false;
  sim.vaultWarned = false;
  sim.toasts = [];
  touch.left = false;
  touch.right = false;
  touch.thrust = false;
  touch.fire = false;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* private mode */
  }
  pushUI();
}

export function startPlaying(): void {
  ensureLoaded();
  sim.playing = true;
  if (!sim.hinted) {
    sim.hinted = true;
    toast("Buy the slag dropper. Collect the vault before it fills.");
    saveSoon();
  }
  pushUI();
}

type SaveBlob = {
  version: number;
  credits: number;
  vault: number;
  owned: string[];
  reforges: number;
  lifetime: number;
  kills: number;
  bestSortie: number;
  redeemed: string[];
  doubleUntil: number;
  hinted: boolean;
};

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readSave(): SaveBlob | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SaveBlob>;
    if (!parsed || typeof parsed !== "object") return null;
    const ownedRaw = Array.isArray(parsed.owned) ? parsed.owned.filter((id) => typeof id === "string") : [];
    const owned: string[] = [];
    for (const item of ITEMS) {
      if (ownedRaw.includes(item.id)) owned.push(item.id);
      else break;
    }
    const redeemed = Array.isArray(parsed.redeemed)
      ? parsed.redeemed.filter((id) => typeof id === "string")
      : [];
    return {
      version: SAVE_VERSION,
      credits: Math.max(0, num(parsed.credits, 40)),
      vault: Math.max(0, num(parsed.vault, 0)),
      owned,
      reforges: Math.max(0, Math.floor(num(parsed.reforges, 0))),
      lifetime: Math.max(0, num(parsed.lifetime, 0)),
      kills: Math.max(0, Math.floor(num(parsed.kills, 0))),
      bestSortie: Math.max(0, Math.floor(num(parsed.bestSortie, 0))),
      redeemed,
      doubleUntil: num(parsed.doubleUntil, 0),
      hinted: Boolean(parsed.hinted),
    };
  } catch {
    return null;
  }
}

export function ensureLoaded(): void {
  if (loaded) return;
  loaded = true;
  const save = readSave();
  if (!save) return;
  sim.credits = save.credits;
  sim.vault = save.vault;
  sim.owned = new Set(save.owned);
  sim.reforges = save.reforges;
  sim.lifetime = save.lifetime;
  sim.kills = save.kills;
  sim.bestSortie = save.bestSortie;
  sim.redeemed = new Set(save.redeemed);
  sim.doubleUntil = save.doubleUntil;
  sim.hinted = save.hinted;
}

function serialize(): string {
  const blob: SaveBlob = {
    version: SAVE_VERSION,
    credits: sim.credits,
    vault: sim.vault,
    owned: ITEMS.filter((item) => sim.owned.has(item.id)).map((item) => item.id),
    reforges: sim.reforges,
    lifetime: sim.lifetime,
    kills: sim.kills,
    bestSortie: sim.bestSortie,
    redeemed: [...sim.redeemed],
    doubleUntil: sim.doubleUntil,
    hinted: sim.hinted,
  };
  return JSON.stringify(blob);
}

export function saveNow(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(SAVE_KEY, serialize());
  } catch {
    /* quota or private mode */
  }
}

function saveSoon(): void {
  if (typeof window === "undefined") return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveNow, 1200);
}

export function tick(dt: number): void {
  const step = Math.min(0.1, Math.max(0, dt));
  sim.time += step;
  sim.shake *= Math.exp(-3.2 * step);
  if (sim.pulse > 0) sim.pulse = Math.max(0, sim.pulse - step);

  if (sim.playing) {
    const inc = incomePerSec();
    if (sim.owned.has("siphon")) {
      const gain = inc * step;
      sim.credits += gain;
      sim.lifetime += gain;
      sim.vault = 0;
    } else if (inc > 0) {
      const cap = vaultCap();
      sim.vault = Math.min(cap, sim.vault + inc * step);
      if (sim.vault >= cap - 0.01 && !sim.vaultWarned) {
        sim.vaultWarned = true;
        toast("Vault full. Collect it.");
      }
    }
  }

  if (sim.mode === "sortie") stepCraft(step);
  stepShots(step);
  placeRaiders();
  if (sim.mode === "sortie") {
    sim.sortieT -= step;
    if (sim.sortieT <= 0) endSortie("Sortie over.");
  }

  if (typeof window !== "undefined") {
    const codes = window.__vfKeys;
    if (codes && codes.length && sim.mode !== "sortie") {
      const pilot = codes.some(
        (code) => code === "KeyW" || code === "KeyA" || code === "KeyS" || code === "KeyD" || code.startsWith("Arrow"),
      );
      if (pilot) beginSortie(true, true);
    }
    window.__vfYaw = sim.craft.yaw;
    window.__vfSpeed = sim.craft.speed;
  }

  sim.uiAcc += step;
  if (sim.uiAcc >= 0.1) {
    const elapsed = sim.uiAcc;
    sim.uiAcc = 0;
    let expired = false;
    for (const entry of sim.toasts) {
      entry.life -= elapsed;
      if (entry.life <= 0) expired = true;
    }
    if (expired) sim.toasts = sim.toasts.filter((entry) => entry.life > 0);
    pushUI();
  }
}

function typingTarget(event: Event): boolean {
  const target = event.target;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

export function bindInput(): () => void {
  const down = (event: KeyboardEvent) => {
    if (typingTarget(event)) return;
    if (event.code === "Space" || event.code.startsWith("Arrow")) event.preventDefault();
    keys.add(event.code);
    if (event.repeat || !sim.playing) return;
    if (event.code === "KeyC" || (event.code === "Space" && sim.mode !== "sortie")) collect();
    if (event.code === "KeyL") toggleSortie();
  };
  const up = (event: KeyboardEvent) => {
    keys.delete(event.code);
  };
  const blur = () => {
    keys.clear();
    touch.left = false;
    touch.right = false;
    touch.thrust = false;
    touch.fire = false;
  };
  const hide = () => {
    if (document.visibilityState === "hidden") saveNow();
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", blur);
  window.addEventListener("pagehide", saveNow);
  document.addEventListener("visibilitychange", hide);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", blur);
    window.removeEventListener("pagehide", saveNow);
    document.removeEventListener("visibilitychange", hide);
  };
}

declare global {
  interface Window {
    __vfProbe?: number;
    __vfTakeover?: boolean;
    __vfYaw?: number;
    __vfSpeed?: number;
    __vfKeys?: string[] | null;
    __vfSteer?: number | null;
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setSteer?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
      _keys?: string[] | null;
    };
  }
}

function installProbe(): void {
  if (typeof window === "undefined") return;
  const qa = import.meta.env.DEV || new URLSearchParams(window.location.search).has("qa");
  if (!qa) return;
  window.__controlsTest = {
    getYaw: () => sim.craft.yaw,
    getSpeed: () => sim.craft.speed,
    setSteer: (value: number) => {
      steerOverride = value;
      window.__vfSteer = value;
      if (sim.mode !== "sortie") beginSortie(true, true);
    },
    setKeys: (codes: string[]) => {
      window.__vfKeys = codes.length ? [...codes] : null;
      keyOverride = window.__vfKeys ? new Set(window.__vfKeys) : null;
      const pilot =
        window.__vfKeys?.some(
          (code) =>
            code === "KeyW" ||
            code === "KeyA" ||
            code === "KeyS" ||
            code === "KeyD" ||
            code.startsWith("Arrow"),
        ) ?? false;
      if (pilot && sim.mode !== "sortie") beginSortie(true, true);
    },
  };
}

function bootClient(): void {
  if (typeof window === "undefined") return;
  const flag = window as Window & { __voidforgeBoot?: boolean };
  if (flag.__voidforgeBoot) return;
  flag.__voidforgeBoot = true;
  ensureLoaded();
  if (typeof window.__vfYaw === "number") sim.craft.yaw = window.__vfYaw;
  if (typeof window.__vfSpeed === "number") sim.craft.speed = window.__vfSpeed;
  window.__vfTakeover = true;
  installProbe();
  bindInput();
  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    tick(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

bootClient();

