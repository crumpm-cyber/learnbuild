import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DNfmi2SV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var ITEMS = [
	{
		id: "dropper",
		name: "Slag Dropper",
		blurb: "Drips ore onto the deck.",
		cost: 25,
		income: 5,
		tag: "drop"
	},
	{
		id: "belt",
		name: "Ferrite Belt",
		blurb: "Feeds the vault.",
		cost: 100,
		income: 4,
		tag: "works"
	},
	{
		id: "crucible",
		name: "Crucible",
		blurb: "Smelts a hotter credit.",
		cost: 280,
		income: 0,
		mult: 1.5,
		note: "×1.5 yield",
		tag: "works"
	},
	{
		id: "dropper2",
		name: "Twin Dropper",
		blurb: "A second spout.",
		cost: 600,
		income: 12,
		tag: "drop"
	},
	{
		id: "keel",
		name: "Keel Ring",
		blurb: "First structural ring.",
		cost: 1200,
		income: 10,
		tag: "hull"
	},
	{
		id: "siphon",
		name: "Vault Siphon",
		blurb: "Collects for you.",
		cost: 2200,
		income: 0,
		note: "Auto-collect",
		tag: "works"
	},
	{
		id: "refinery",
		name: "Refinery",
		blurb: "Cleaner yield.",
		cost: 4500,
		income: 0,
		mult: 1.55,
		note: "×1.55 yield",
		tag: "works"
	},
	{
		id: "reactor",
		name: "Amber Reactor",
		blurb: "The heart lights up.",
		cost: 9e3,
		income: 36,
		tag: "hull"
	},
	{
		id: "dock",
		name: "Launch Dock",
		blurb: "Sorties pay more.",
		cost: 16e3,
		income: 16,
		tag: "war"
	},
	{
		id: "turrets",
		name: "Aegis Turrets",
		blurb: "A ring of guns.",
		cost: 3e4,
		income: 42,
		tag: "war"
	},
	{
		id: "cascade",
		name: "Kiln Cascade",
		blurb: "Ore never stops.",
		cost: 55e3,
		income: 90,
		tag: "drop"
	},
	{
		id: "shell",
		name: "Panel Shell",
		blurb: "The shell closes.",
		cost: 1e5,
		income: 55,
		tag: "hull"
	},
	{
		id: "lance",
		name: "Prism Lance",
		blurb: "A cutting beam.",
		cost: 19e4,
		income: 140,
		tag: "war"
	},
	{
		id: "bay",
		name: "Fleet Bay",
		blurb: "A heavier skiff.",
		cost: 36e4,
		income: 100,
		tag: "war"
	},
	{
		id: "spire",
		name: "Command Spire",
		blurb: "See the whole belt.",
		cost: 7e5,
		income: 180,
		tag: "hull"
	},
	{
		id: "miner",
		name: "Belt Miner",
		blurb: "Chews the asteroid ring.",
		cost: 13e5,
		income: 320,
		tag: "drop"
	},
	{
		id: "plating",
		name: "Void Plating",
		blurb: "Armor against the dark.",
		cost: 24e5,
		income: 220,
		tag: "hull"
	},
	{
		id: "kiln",
		name: "Singularity Kiln",
		blurb: "Doubles the forge.",
		cost: 48e5,
		income: 0,
		mult: 2,
		note: "×2 yield",
		tag: "works"
	},
	{
		id: "crown",
		name: "Crown Array",
		blurb: "The citadel is finished.",
		cost: 95e5,
		income: 700,
		tag: "hull"
	}
];
var ITEM_INDEX = new Map(ITEMS.map((item, index) => [item.id, index]));
function itemById(id) {
	const index = ITEM_INDEX.get(id);
	return index === void 0 ? void 0 : ITEMS[index];
}
function formatCredits(n) {
	if (!Number.isFinite(n)) return "0";
	const sign = n < 0 ? "-" : "";
	const value = Math.abs(n);
	if (value < 1e3) return sign + Math.floor(value).toString();
	const units = [
		"K",
		"M",
		"B",
		"T"
	];
	let unit = -1;
	let scaled = value;
	while (scaled >= 1e3 && unit < units.length - 1) {
		scaled /= 1e3;
		unit += 1;
	}
	const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
	return sign + scaled.toFixed(digits) + units[unit];
}
var ctx = null;
var failed = false;
function ac() {
	if (failed || typeof window === "undefined") return null;
	try {
		if (!ctx) ctx = new AudioContext();
		if (ctx.state === "suspended") ctx.resume();
		return ctx;
	} catch {
		failed = true;
		return null;
	}
}
function unlockAudio() {
	ac();
}
function env(freq, dur, type, gain = .03, slide) {
	const c = ac();
	if (!c) return;
	try {
		const osc = c.createOscillator();
		const amp = c.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, c.currentTime);
		if (slide && slide > 0) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slide), c.currentTime + dur);
		amp.gain.setValueAtTime(gain, c.currentTime);
		amp.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + dur);
		osc.connect(amp);
		amp.connect(c.destination);
		osc.start();
		osc.stop(c.currentTime + dur + .02);
	} catch {}
}
function playBuy() {
	env(220, .07, "square", .02);
	env(440, .1, "square", .02);
}
function playCollect() {
	env(660, .06, "triangle", .03, 990);
}
function playLaunch() {
	env(140, .22, "sawtooth", .02, 420);
}
function playShot() {
	env(880, .04, "square", .012, 220);
}
function playKill() {
	env(520, .08, "triangle", .028, 180);
}
function playReforge() {
	env(90, .28, "sine", .04, 40);
	env(360, .18, "triangle", .02);
}
var SAVE_KEY = "voidforge-save-v1";
var SAVE_VERSION = 1;
var RAIDERS = Array.from({ length: 10 }, (_, i) => ({
	x: 0,
	y: 0,
	z: 0,
	seed: i * 1.37 + .4,
	alive: true
}));
var SHOTS = Array.from({ length: 32 }, () => ({
	x: 0,
	y: 0,
	z: 0,
	vx: 0,
	vy: 0,
	vz: 0,
	life: 0
}));
var touch = {
	left: false,
	right: false,
	thrust: false,
	fire: false
};
var sim = {
	playing: false,
	mode: "build",
	credits: 40,
	vault: 0,
	owned: /* @__PURE__ */ new Set(),
	reforges: 0,
	lifetime: 0,
	kills: 0,
	bestSortie: 0,
	redeemed: /* @__PURE__ */ new Set(),
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
	craft: {
		x: 0,
		y: 2.2,
		z: 16,
		yaw: 0,
		speed: 0,
		steer: 0
	},
	toasts: [],
	uiAcc: 0
};
var listeners = /* @__PURE__ */ new Set();
var keys = /* @__PURE__ */ new Set();
var keyOverride = null;
var steerOverride = null;
var loaded = false;
var toastSeq = 1;
var saveTimer = 0;
function subscribeUI(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function pushUI() {
	for (const fn of listeners) fn();
}
function has(id) {
	return sim.owned.has(id);
}
function citadelPercent() {
	return Math.round(sim.owned.size / ITEMS.length * 100);
}
function vaultCap() {
	return (70 + sim.owned.size * 110) * (1 + sim.reforges * .4);
}
function forgeMark() {
	return 1 + sim.reforges * .5;
}
function incomePerSec() {
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
function itemState(id) {
	const index = ITEMS.findIndex((item) => item.id === id);
	if (index < 0) return "locked";
	if (sim.owned.has(id)) return "owned";
	if (index === 0 || sim.owned.has(ITEMS[index - 1].id)) return "next";
	return "locked";
}
function canReforge() {
	return sim.owned.has("reactor");
}
function skiffName() {
	if (sim.owned.has("bay")) return "Lancewing";
	if (sim.owned.has("dock")) return "Interceptor";
	return "Haul skiff";
}
function toast(text) {
	sim.toasts.unshift({
		id: toastSeq++,
		text,
		life: 3.4
	});
	if (sim.toasts.length > 3) sim.toasts.length = 3;
	pushUI();
}
function held(code) {
	if (keyOverride) return keyOverride.has(code);
	return keys.has(code);
}
function killReward() {
	const inc = Math.max(incomePerSec(), 4);
	const gear = sim.owned.has("bay") ? 2.3 : sim.owned.has("dock") ? 1.55 : 1;
	return Math.max(40, inc * 5.5) * gear;
}
function destroyRaider(raider) {
	if (!raider.alive || sim.mode !== "sortie") return;
	raider.alive = false;
	const pay = killReward();
	sim.credits += pay;
	sim.lifetime += pay;
	sim.kills += 1;
	sim.sortieKills += 1;
	sim.sortieEarnings += pay;
	if (sim.sortieKills > sim.bestSortie) sim.bestSortie = sim.sortieKills;
	sim.shake = Math.min(1, sim.shake + .45);
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
function spawnShot(fx, fz) {
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
function tapFire() {
	if (sim.mode === "sortie") sim.fireLatch = true;
}
function stepCraft(dt) {
	const craft = sim.craft;
	let steer = 0;
	if (held("KeyA") || held("ArrowLeft") || touch.left) steer += 1;
	if (held("KeyD") || held("ArrowRight") || touch.right) steer -= 1;
	if (steerOverride !== null) steer = steerOverride;
	const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
	const pad = pads ? pads[0] : null;
	if (pad && !keyOverride && steerOverride === null) {
		const axis = pad.axes[0] ?? 0;
		if (Math.abs(axis) > .18) steer += -axis;
	}
	steer = Math.max(-1, Math.min(1, steer));
	craft.steer = steer;
	craft.yaw += steer * 2.4 * dt;
	let throttle = 0;
	if (held("KeyW") || held("ArrowUp") || touch.thrust) throttle += 1;
	if (held("KeyS") || held("ArrowDown")) throttle -= .6;
	if (pad && !keyOverride) {
		if ((pad.axes[1] ?? 0) < -.28 || pad.buttons[7]?.pressed) throttle += 1;
		if (pad.buttons[6]?.pressed) throttle -= .6;
		if (pad.buttons[0]?.pressed) sim.fireLatch = true;
	}
	throttle = Math.max(-.6, Math.min(1, throttle));
	const target = throttle * 26;
	craft.speed += (target - craft.speed) * (1 - Math.exp(-3.4 * dt));
	const fx = -Math.sin(craft.yaw);
	const fz = -Math.cos(craft.yaw);
	craft.x += fx * craft.speed * dt;
	craft.z += fz * craft.speed * dt;
	craft.y = 2.1 + Math.sin(sim.time * 1.6) * .12;
	const radius = Math.hypot(craft.x, craft.z);
	if (radius > 36) {
		craft.x *= 36 / radius;
		craft.z *= 36 / radius;
	}
	sim.fireCd -= dt;
	if ((held("Space") || touch.fire || sim.fireLatch) && sim.fireCd <= 0) {
		sim.fireCd = .15;
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
			craft.speed *= .3;
			sim.shake = Math.min(1, sim.shake + .55);
		}
	}
}
function stepShots(dt) {
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
function placeRaiders() {
	const ambient = sim.mode !== "sortie";
	for (let i = 0; i < RAIDERS.length; i += 1) {
		const raider = RAIDERS[i];
		if (ambient) raider.alive = i < 7;
		if (!raider.alive) continue;
		const angle = sim.time * (.17 + i % 5 * .025) + raider.seed;
		const radius = 7 + i % 4 * 1.65 + (ambient ? 1.4 : 0);
		raider.x = Math.cos(angle) * radius;
		raider.z = Math.sin(angle) * radius;
		raider.y = i % 3 - 1 + Math.sin(sim.time * .8 + raider.seed) * .45;
	}
}
function beginSortie(fromProbe) {
	sim.mode = "sortie";
	sim.playing = true;
	sim.sortieT = 50;
	sim.sortieKills = 0;
	sim.sortieEarnings = 0;
	sim.sortieCleared = false;
	sim.wave = sim.owned.has("bay") ? 10 : 7;
	sim.fireCd = .2;
	sim.fireLatch = false;
	sim.craft.x = 0;
	sim.craft.y = 2.2;
	sim.craft.z = 16;
	sim.craft.yaw = 0;
	sim.craft.speed = fromProbe ? 0 : 9;
	sim.craft.steer = 0;
	for (let i = 0; i < RAIDERS.length; i += 1) RAIDERS[i].alive = i < sim.wave;
	for (const shot of SHOTS) shot.life = 0;
	if (!fromProbe) {
		toast(`${skiffName()} launched. Break the raiders.`);
		playLaunch();
		pushUI();
		saveSoon();
	}
}
function endSortie(reason) {
	if (sim.mode !== "sortie") return;
	sim.mode = "build";
	touch.left = false;
	touch.right = false;
	touch.thrust = false;
	touch.fire = false;
	toast(sim.sortieKills > 0 ? `${reason} ${sim.sortieKills} kills · +${formatCredits(sim.sortieEarnings)}` : reason);
	pushUI();
	saveSoon();
}
function toggleSortie() {
	ensureLoaded();
	sim.playing = true;
	if (!sim.hinted) sim.hinted = true;
	if (sim.mode === "sortie") endSortie("Docked.");
	else beginSortie(false);
}
function buy(id) {
	const item = itemById(id);
	if (!item) return;
	if (sim.owned.has(id)) return;
	if (itemState(id) === "locked") {
		toast("Build the previous module first.");
		return;
	}
	if (sim.credits + 1e-6 < item.cost) {
		toast(`Need ${formatCredits(item.cost - sim.credits)} more.`);
		return;
	}
	sim.credits -= item.cost;
	sim.owned.add(id);
	sim.shake = Math.min(1, sim.shake + .3);
	sim.pulse = 1;
	playBuy();
	toast(`${item.name} online.`);
	if (sim.owned.size === ITEMS.length) toast("Citadel complete. Reforge to raise the mark.");
	pushUI();
	saveSoon();
}
function collect() {
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
function reforge() {
	if (!canReforge()) {
		toast("Bring the amber reactor online before a reforge.");
		return;
	}
	sim.reforges += 1;
	sim.credits = 120 * sim.reforges;
	sim.vault = 0;
	sim.owned = /* @__PURE__ */ new Set();
	sim.mode = "build";
	sim.doubleUntil = 0;
	sim.vaultWarned = false;
	playReforge();
	toast(`Reforged. Yield mark ×${sim.reforges}. Credits reset with a stipend.`);
	pushUI();
	saveNow();
}
function redeem(code) {
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
		sim.doubleUntil = Date.now() + 9e4;
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
		sim.credits += 5e3;
		toast("Orbit dividend: +5,000.");
	} else {
		toast("Unknown frequency.");
		return;
	}
	pushUI();
	saveSoon();
}
function resetAll() {
	sim.playing = false;
	sim.mode = "build";
	sim.credits = 40;
	sim.vault = 0;
	sim.owned = /* @__PURE__ */ new Set();
	sim.reforges = 0;
	sim.lifetime = 0;
	sim.kills = 0;
	sim.bestSortie = 0;
	sim.redeemed = /* @__PURE__ */ new Set();
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
	} catch {}
	pushUI();
}
function startPlaying() {
	ensureLoaded();
	sim.playing = true;
	if (!sim.hinted) {
		sim.hinted = true;
		toast("Buy the slag dropper. Collect the vault before it fills.");
		saveSoon();
	}
	pushUI();
}
function num(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function readSave() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		const ownedRaw = Array.isArray(parsed.owned) ? parsed.owned.filter((id) => typeof id === "string") : [];
		const owned = [];
		for (const item of ITEMS) if (ownedRaw.includes(item.id)) owned.push(item.id);
		else break;
		const redeemed = Array.isArray(parsed.redeemed) ? parsed.redeemed.filter((id) => typeof id === "string") : [];
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
			hinted: Boolean(parsed.hinted)
		};
	} catch {
		return null;
	}
}
function ensureLoaded() {
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
function serialize() {
	const blob = {
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
		hinted: sim.hinted
	};
	return JSON.stringify(blob);
}
function saveNow() {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(SAVE_KEY, serialize());
	} catch {}
}
function saveSoon() {
	if (typeof window === "undefined") return;
	window.clearTimeout(saveTimer);
	saveTimer = window.setTimeout(saveNow, 1200);
}
function tick(dt) {
	const step = Math.min(.1, Math.max(0, dt));
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
			if (sim.vault >= cap - .01 && !sim.vaultWarned) {
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
	sim.uiAcc += step;
	if (sim.uiAcc >= .1) {
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
function typingTarget(event) {
	const target = event.target;
	return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}
function bindInput() {
	const down = (event) => {
		if (typingTarget(event)) return;
		if (event.code === "Space" || event.code.startsWith("Arrow")) event.preventDefault();
		keys.add(event.code);
		if (event.repeat || !sim.playing) return;
		if (event.code === "KeyC" || event.code === "Space" && sim.mode !== "sortie") collect();
		if (event.code === "KeyL") toggleSortie();
	};
	const up = (event) => {
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
function installProbe() {
	if (typeof window === "undefined") return;
	if (!new URLSearchParams(window.location.search).has("qa")) return;
	window.__controlsTest = {
		getYaw: () => sim.craft.yaw,
		getSpeed: () => sim.craft.speed,
		setSteer: (value) => {
			steerOverride = value;
			if (sim.mode !== "sortie") beginSortie(true);
		},
		setKeys: (codes) => {
			keyOverride = codes.length ? new Set(codes) : null;
			if (codes.some((code) => code === "KeyW" || code === "KeyA" || code === "KeyS" || code === "KeyD" || code.startsWith("Arrow")) && sim.mode !== "sortie") beginSortie(true);
		}
	};
}
function useSimRevision() {
	const [revision, setRevision] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => subscribeUI(() => setRevision((value) => (value + 1) % 1e6)), []);
	return revision;
}
function hold(flag) {
	const set = (value) => {
		touch[flag] = value;
		pushUI();
	};
	return {
		onPointerDown: (event) => {
			event.preventDefault();
			event.currentTarget.setPointerCapture(event.pointerId);
			set(true);
		},
		onPointerUp: () => set(false),
		onPointerCancel: () => set(false),
		onContextMenu: (event) => event.preventDefault()
	};
}
function Game() {
	const revision = useSimRevision();
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [panel, setPanel] = (0, import_react.useState)("none");
	const canvasRef = (0, import_react.useRef)(null);
	const panelRef = (0, import_react.useRef)(panel);
	panelRef.current = panel;
	(0, import_react.useEffect)(() => {
		ensureLoaded();
		setBooted(true);
		installProbe();
		const unbind = bindInput();
		const unlock = () => unlockAudio();
		window.addEventListener("pointerdown", unlock);
		let frame = 0;
		let last = performance.now();
		let alive = true;
		const loop = (now) => {
			if (!alive) return;
			const dt = Math.min(.1, (now - last) / 1e3);
			last = now;
			tick(dt);
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		const onKey = (event) => {
			if (event.code !== "Escape") return;
			if (panelRef.current !== "none") {
				setPanel("none");
				return;
			}
			if (sim.mode === "sortie") endSortie("Docked.");
		};
		window.addEventListener("keydown", onKey);
		return () => {
			alive = false;
			cancelAnimationFrame(frame);
			unbind();
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", onKey);
			saveNow();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let dead = false;
		let unmount = () => {};
		import("./scene-BBuR6ccL.mjs").then((mod) => {
			if (dead) return;
			unmount = mod.mountScene(canvas);
			pushUI();
		});
		return () => {
			dead = true;
			unmount();
		};
	}, []);
	const playing = sim.playing;
	const surge = Date.now() < sim.doubleUntil;
	const full = !sim.owned.has("siphon") && sim.vault >= vaultCap() - 1 && incomePerSec() > 0;
	const nextIndex = ITEMS.findIndex((item) => itemState(item.id) === "next");
	(0, import_react.useEffect)(() => {
		document.querySelector("[data-next='1']")?.scrollIntoView({
			inline: "center",
			block: "nearest",
			behavior: "smooth"
		});
	}, [sim.owned.size]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg",
		"data-rev": revision,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "absolute inset-0 h-full w-full touch-none",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 vignette" }),
					sim.viewError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pointer-events-none absolute inset-x-4 top-1/3 text-center text-sm text-muted",
						children: sim.viewError
					}) : null,
					playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-bg/80 px-3 py-2 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-base uppercase leading-none tracking-widest text-amber sm:text-lg",
								children: "Voidforge"
							}), sim.mode === "sortie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-amber tabular-nums",
								children: [
									Math.max(0, Math.ceil(sim.sortieT)),
									"s · ",
									sim.sortieKills,
									"/",
									sim.wave,
									" raiders"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 truncate text-xs text-muted",
								children: [
									citadelPercent(),
									"% citadel · ",
									sim.owned.size,
									"/",
									ITEMS.length,
									sim.reforges > 0 ? ` · mark ${sim.reforges}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg tabular-nums leading-none sm:text-xl",
								children: formatCredits(sim.credits)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-amber tabular-nums",
								children: [
									formatCredits(incomePerSec()),
									"/s",
									surge ? " · surge" : ""
								]
							})]
						})]
					}) : null,
					playing && sim.mode === "sortie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pointer-events-none absolute inset-x-0 top-14 z-10 px-3 text-center text-xs text-muted",
						children: "W / ↑ thrust · A / ← left · D / → right · Space fire · L dock"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-x-0 top-16 z-20 flex flex-col items-center gap-2 px-3 sm:top-20",
						children: sim.toasts.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm rounded-lg border border-line bg-surface/95 px-3 py-2 text-center text-sm text-fg",
							children: entry.text
						}, entry.id))
					}),
					playing && sim.mode === "sortie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-6 rounded-full border border-amber/80" })
					}) : null,
					!playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-bg/75 p-6 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xs uppercase tracking-widest text-amber",
									children: "Orbital citadel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 font-display text-5xl uppercase leading-none tracking-wide text-fg sm:text-6xl",
									children: "Voidforge"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-px w-16 bg-amber" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-5 space-y-2 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Buy modules. The sphere grows as the citadel does." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ore fills a vault. Collect it, or it stalls when full." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Launch the skiff and break raiders for a combat payout." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-6 min-h-12 w-full rounded-xl bg-amber px-4 font-display text-lg uppercase tracking-wider text-bg",
									onClick: () => {
										unlockAudio();
										startPlaying();
									},
									children: "Start the forge"
								}),
								booted && (sim.lifetime > 0 || sim.owned.size > 0 || sim.reforges > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-muted",
									children: [
										"Citadel restored · ",
										citadelPercent(),
										"% · ",
										formatCredits(sim.credits),
										" banked",
										sim.reforges > 0 ? ` · mark ${sim.reforges}` : ""
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: "Progress stays on this device."
								})
							]
						})
					}) : null
				]
			}),
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "dock z-10 min-w-0 shrink-0 overflow-hidden border-t border-line bg-surface",
				children: [
					sim.mode === "sortie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2 px-2 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-12 rounded-xl border border-line bg-raised font-display text-sm uppercase text-fg",
								...hold("left"),
								children: "Left"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-12 rounded-xl bg-amber font-display text-sm uppercase text-bg",
								...hold("thrust"),
								children: "Thrust"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-12 rounded-xl border border-line bg-raised font-display text-sm uppercase text-fg",
								...hold("right"),
								children: "Right"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-12 rounded-xl border border-amber bg-raised font-display text-sm uppercase text-amber",
								...hold("fire"),
								children: "Fire"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2 p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => collect(),
								className: "flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl px-1 " + (sim.owned.has("siphon") ? "bg-raised text-amber" : sim.vault >= 1 ? "bg-amber text-bg" : "bg-raised text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs uppercase tracking-wide",
									children: sim.owned.has("siphon") ? "Siphon" : full ? "Full" : "Collect"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm tabular-nums",
									children: sim.owned.has("siphon") ? "Auto" : formatCredits(sim.vault)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleSortie(),
								className: "flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-amber bg-raised px-1 text-amber",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs uppercase tracking-wide",
									children: sim.mode === "sortie" ? "Dock" : "Launch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-full min-w-0 truncate text-xs text-muted",
									children: skiffName()
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									if (!canReforge()) {
										reforge();
										return;
									}
									setPanel("reforge");
								},
								className: "flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-line bg-raised px-1 text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs uppercase tracking-wide",
									children: "Reforge"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted",
									children: ["Mark ", forgeMark().toFixed(1)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPanel("signal"),
								className: "flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-line bg-raised px-1 text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs uppercase tracking-wide",
									children: "Signal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted",
									children: "Codes"
								})]
							})
						]
					}),
					sim.owned.size === ITEMS.length && sim.mode !== "sortie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 pb-1 text-center text-xs text-amber",
						children: "Citadel complete. Reforge to raise the mark."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "forge-scroll flex w-full min-w-0 gap-2 overflow-x-auto px-2 pb-3",
						children: ITEMS.map((item, index) => {
							const state = itemState(item.id);
							const affordable = state === "next" && sim.credits + 1e-6 >= item.cost;
							const line = item.note ?? (item.income > 0 ? `+${formatCredits(item.income)}/s` : "Module");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-next": index === nextIndex ? "1" : void 0,
								onClick: () => buy(item.id),
								className: "w-36 shrink-0 rounded-xl border px-3 py-2 text-left " + (state === "owned" ? "border-line bg-bg text-muted" : affordable ? "forge-next border-amber bg-raised text-fg" : state === "next" ? "border-line bg-raised text-fg" : "border-line bg-bg text-muted"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-display text-sm uppercase tracking-wide",
										children: item.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 block truncate text-xs text-muted",
										children: state === "locked" ? "Locked" : item.blurb
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 block font-display text-sm tabular-nums " + (state === "owned" ? "text-muted" : "text-amber"),
										children: state === "owned" ? "Online" : state === "locked" ? "—" : `${formatCredits(item.cost)} · ${line}`
									})
								]
							}, item.id);
						})
					})
				]
			}) : null,
			panel !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 flex items-end justify-center bg-bg/75 p-3 sm:items-center",
				role: "presentation",
				onClick: () => setPanel("none"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-4",
					onClick: (event) => event.stopPropagation(),
					children: [
						panel === "reforge" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl uppercase tracking-wide",
								children: "Reforge the citadel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Modules and credits reset. Your forge mark stays and every future yield is higher. You keep a small stipend."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-12 flex-1 rounded-xl bg-amber font-display uppercase text-bg",
									onClick: () => {
										reforge();
										setPanel("none");
									},
									children: "Reforge"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-12 flex-1 rounded-xl border border-line font-display uppercase",
									onClick: () => setPanel("none"),
									children: "Keep building"
								})]
							})
						] }) : null,
						panel === "wipe" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl uppercase tracking-wide",
								children: "Abandon citadel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "This wipes credits, modules, marks, and codes on this device."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-12 flex-1 rounded-xl bg-amber font-display uppercase text-bg",
									onClick: () => {
										resetAll();
										setPanel("none");
									},
									children: "Wipe save"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-12 flex-1 rounded-xl border border-line font-display uppercase",
									onClick: () => setPanel("signal"),
									children: "Back"
								})]
							})
						] }) : null,
						panel === "signal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl uppercase tracking-wide",
									children: "Signal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-lg px-3 text-sm text-muted",
									onClick: () => setPanel("none"),
									children: "Close"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-raised px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "Lifetime"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-display tabular-nums",
											children: formatCredits(sim.lifetime)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-raised px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "Raider kills"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-display tabular-nums",
											children: sim.kills
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-raised px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "Best sortie"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-display tabular-nums",
											children: sim.bestSortie
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-raised px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted",
											children: "Forge mark"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "font-display tabular-nums",
											children: ["×", forgeMark().toFixed(1)]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs uppercase tracking-widest text-muted",
								children: "Open frequencies"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: sim.redeemed.has("SLAG"),
										className: "min-h-12 rounded-xl border border-line bg-raised px-3 text-left disabled:opacity-50",
										onClick: () => redeem("SLAG"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display uppercase",
											children: "SLAG"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-xs text-muted",
											children: sim.redeemed.has("SLAG") ? "Used" : "Stipend · +500"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: sim.redeemed.has("KILN"),
										className: "min-h-12 rounded-xl border border-line bg-raised px-3 text-left disabled:opacity-50",
										onClick: () => redeem("KILN"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display uppercase",
											children: "KILN"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-xs text-muted",
											children: sim.redeemed.has("KILN") ? "Used" : "Double yield for 90 seconds"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: sim.redeemed.has("ORBIT") || sim.reforges < 1,
										className: "min-h-12 rounded-xl border border-line bg-raised px-3 text-left disabled:opacity-50",
										onClick: () => redeem("ORBIT"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display uppercase",
											children: "ORBIT"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-xs text-muted",
											children: sim.redeemed.has("ORBIT") ? "Used" : sim.reforges < 1 ? "Reforge once to unlock · +5,000" : "Dividend · +5,000"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-4 min-h-12 w-full rounded-xl border border-line text-sm text-muted",
								onClick: () => setPanel("wipe"),
								children: "Abandon citadel"
							})
						] }) : null
					]
				})
			}) : null
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = Game;
//#endregion
export { incomePerSec as a, vaultCap as c, has as i, RAIDERS as n, sim as o, SHOTS as r, tapFire as s, routes_exports as t };
