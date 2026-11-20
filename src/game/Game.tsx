import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ITEMS, formatCredits } from "@/game/catalog";
import { unlockAudio } from "@/game/audio";
import {
  buy,
  canReforge,
  citadelPercent,
  collect,
  endSortie,
  ensureLoaded,
  forgeMark,
  incomePerSec,
  itemState,
  pushUI,
  redeem,
  reforge,
  resetAll,
  saveNow,
  sim,
  skiffName,
  startPlaying,
  subscribeUI,
  toggleSortie,
  touch,
  vaultCap,
} from "@/game/sim";

function useSimRevision(): number {
  const [revision, setRevision] = useState(0);
  useEffect(() => subscribeUI(() => setRevision((value) => (value + 1) % 1_000_000)), []);
  return revision;
}

function hold(flag: "left" | "right" | "thrust" | "fire") {
  const set = (value: boolean) => {
    touch[flag] = value;
    pushUI();
  };
  return {
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      set(true);
    },
    onPointerUp: () => set(false),
    onPointerCancel: () => set(false),
    onContextMenu: (event: MouseEvent) => event.preventDefault(),
  };
}

export function Game() {
  const revision = useSimRevision();
  const [booted, setBooted] = useState(false);
  const [panel, setPanel] = useState<"none" | "signal" | "reforge" | "wipe">("none");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef(panel);
  panelRef.current = panel;

  useEffect(() => {
    ensureLoaded();
    setBooted(true);
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock);
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Escape") return;
      if (panelRef.current !== "none") {
        setPanel("none");
        return;
      }
      if (sim.mode === "sortie") endSortie("Docked.");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", onKey);
      saveNow();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    let unmount = () => {};
    void import("./scene").then((mod) => {
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

  useEffect(() => {
    const node = document.querySelector<HTMLElement>("[data-next='1']");
    node?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [sim.owned.size]);

  return (
    <main className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg" data-rev={revision}>
      <div className="relative min-h-0 flex-1">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 vignette" />
        {sim.viewError ? (
          <p className="pointer-events-none absolute inset-x-4 top-1/3 text-center text-sm text-muted">{sim.viewError}</p>
        ) : null}

        {playing ? (
          <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-bg/80 px-3 py-2 backdrop-blur-md">
            <div className="min-w-0">
              <p className="font-display text-base uppercase leading-none tracking-widest text-amber sm:text-lg">Voidforge</p>
              {sim.mode === "sortie" ? (
                <p className="mt-1 text-xs text-amber tabular-nums">
                  {Math.max(0, Math.ceil(sim.sortieT))}s · {sim.sortieKills}/{sim.wave} raiders
                </p>
              ) : (
                <p className="mt-1 truncate text-xs text-muted">
                  {citadelPercent()}% citadel · {sim.owned.size}/{ITEMS.length}
                  {sim.reforges > 0 ? ` · mark ${sim.reforges}` : ""}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-display text-lg tabular-nums leading-none sm:text-xl">{formatCredits(sim.credits)}</p>
              <p className="mt-1 text-xs text-amber tabular-nums">
                {formatCredits(incomePerSec())}/s{surge ? " · surge" : ""}
              </p>
            </div>
          </header>
        ) : null}

        {playing && sim.mode === "sortie" ? (
          <p className="pointer-events-none absolute inset-x-0 top-14 z-10 px-3 text-center text-xs text-muted">
            W / ↑ thrust · A / ← left · D / → right · Space fire · L dock
          </p>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex flex-col items-center gap-2 px-3 sm:top-20">
          {sim.toasts.map((entry) => (
            <p key={entry.id} className="max-w-sm rounded-lg border border-line bg-surface/95 px-3 py-2 text-center text-sm text-fg">
              {entry.text}
            </p>
          ))}
        </div>

        {playing && sim.mode === "sortie" ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="size-6 rounded-full border border-amber/80" />
          </div>
        ) : null}

        {!playing ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-bg/75 p-6 backdrop-blur-sm">
            <div className="w-full max-w-md">
              <p className="font-display text-xs uppercase tracking-widest text-amber">Orbital citadel</p>
              <h1 className="mt-2 font-display text-5xl uppercase leading-none tracking-wide text-fg sm:text-6xl">Voidforge</h1>
              <div className="mt-4 h-px w-16 bg-amber" />
              <ul className="mt-5 space-y-2 text-sm text-muted">
                <li>Buy modules. The sphere grows as the citadel does.</li>
                <li>Ore fills a vault. Collect it, or it stalls when full.</li>
                <li>Launch the skiff and break raiders for a combat payout.</li>
              </ul>
              <button
                type="button"
                className="mt-6 min-h-12 w-full rounded-xl bg-amber px-4 font-display text-lg uppercase tracking-wider text-bg"
                onClick={() => {
                  unlockAudio();
                  startPlaying();
                }}
              >
                Start the forge
              </button>
              {booted && (sim.lifetime > 0 || sim.owned.size > 0 || sim.reforges > 0) ? (
                <p className="mt-3 text-sm text-muted">
                  Citadel restored · {citadelPercent()}% · {formatCredits(sim.credits)} banked
                  {sim.reforges > 0 ? ` · mark ${sim.reforges}` : ""}
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted">Progress stays on this device.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {playing ? (
        <footer className="dock z-10 min-w-0 shrink-0 overflow-hidden border-t border-line bg-surface">
          {sim.mode === "sortie" ? (
            <div className="grid grid-cols-4 gap-2 px-2 pt-2">
              <button type="button" className="min-h-12 rounded-xl border border-line bg-raised font-display text-sm uppercase text-fg" {...hold("left")}>
                Left
              </button>
              <button type="button" className="min-h-12 rounded-xl bg-amber font-display text-sm uppercase text-bg" {...hold("thrust")}>
                Thrust
              </button>
              <button type="button" className="min-h-12 rounded-xl border border-line bg-raised font-display text-sm uppercase text-fg" {...hold("right")}>
                Right
              </button>
              <button type="button" className="min-h-12 rounded-xl border border-amber bg-raised font-display text-sm uppercase text-amber" {...hold("fire")}>
                Fire
              </button>
            </div>
          ) : null}
          <div className="grid grid-cols-4 gap-2 p-2">
            <button
              type="button"
              onClick={() => collect()}
              className={
                "flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl px-1 " +
                (sim.owned.has("siphon")
                  ? "bg-raised text-amber"
                  : sim.vault >= 1
                    ? "bg-amber text-bg"
                    : "bg-raised text-muted")
              }
            >
              <span className="font-display text-xs uppercase tracking-wide">{sim.owned.has("siphon") ? "Siphon" : full ? "Full" : "Collect"}</span>
              <span className="font-display text-sm tabular-nums">{sim.owned.has("siphon") ? "Auto" : formatCredits(sim.vault)}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSortie()}
              className="flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-amber bg-raised px-1 text-amber"
            >
              <span className="font-display text-xs uppercase tracking-wide">{sim.mode === "sortie" ? "Dock" : "Launch"}</span>
              <span className="w-full min-w-0 truncate text-xs text-muted">{skiffName()}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!canReforge()) {
                  reforge();
                  return;
                }
                setPanel("reforge");
              }}
              className="flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-line bg-raised px-1 text-fg"
            >
              <span className="font-display text-xs uppercase tracking-wide">Reforge</span>
              <span className="text-xs text-muted">Mark {forgeMark().toFixed(1)}</span>
            </button>
            <button
              type="button"
              onClick={() => setPanel("signal")}
              className="flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-line bg-raised px-1 text-fg"
            >
              <span className="font-display text-xs uppercase tracking-wide">Signal</span>
              <span className="text-[11px] text-muted">Codes</span>
            </button>
          </div>
          {sim.owned.size === ITEMS.length && sim.mode !== "sortie" ? (
            <p className="px-3 pb-1 text-center text-xs text-amber">Citadel complete. Reforge to raise the mark.</p>
          ) : null}
          <div className="forge-scroll flex w-full min-w-0 gap-2 overflow-x-auto px-2 pb-3">
            {ITEMS.map((item, index) => {
              const state = itemState(item.id);
              const affordable = state === "next" && sim.credits + 1e-6 >= item.cost;
              const line = item.note ?? (item.income > 0 ? `+${formatCredits(item.income)}/s` : "Module");
              return (
                <button
                  key={item.id}
                  type="button"
                  data-next={index === nextIndex ? "1" : undefined}
                  onClick={() => buy(item.id)}
                  className={
                    "w-36 shrink-0 rounded-xl border px-3 py-2 text-left " +
                    (state === "owned"
                      ? "border-line bg-bg text-muted"
                      : affordable
                        ? "forge-next border-amber bg-raised text-fg"
                        : state === "next"
                          ? "border-line bg-raised text-fg"
                          : "border-line bg-bg text-muted")
                  }
                >
                  <span className="block truncate font-display text-sm uppercase tracking-wide">{item.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{state === "locked" ? "Locked" : item.blurb}</span>
                  <span className={"mt-2 block font-display text-sm tabular-nums " + (state === "owned" ? "text-muted" : "text-amber")}>
                    {state === "owned" ? "Online" : state === "locked" ? "—" : `${formatCredits(item.cost)} · ${line}`}
                  </span>
                </button>
              );
            })}
          </div>
        </footer>
      ) : null}

      {panel !== "none" ? (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/75 p-3 sm:items-center" role="presentation" onClick={() => setPanel("none")}>
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-4"
            onClick={(event) => event.stopPropagation()}
          >
            {panel === "reforge" ? (
              <>
                <h2 className="font-display text-xl uppercase tracking-wide">Reforge the citadel</h2>
                <p className="mt-2 text-sm text-muted">
                  Modules and credits reset. Your forge mark stays and every future yield is higher. You keep a small stipend.
                </p>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="min-h-12 flex-1 rounded-xl bg-amber font-display uppercase text-bg" onClick={() => { reforge(); setPanel("none"); }}>
                    Reforge
                  </button>
                  <button type="button" className="min-h-12 flex-1 rounded-xl border border-line font-display uppercase" onClick={() => setPanel("none")}>
                    Keep building
                  </button>
                </div>
              </>
            ) : null}
            {panel === "wipe" ? (
              <>
                <h2 className="font-display text-xl uppercase tracking-wide">Abandon citadel</h2>
                <p className="mt-2 text-sm text-muted">This wipes credits, modules, marks, and codes on this device.</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="min-h-12 flex-1 rounded-xl bg-amber font-display uppercase text-bg"
                    onClick={() => {
                      resetAll();
                      setPanel("none");
                    }}
                  >
                    Wipe save
                  </button>
                  <button type="button" className="min-h-12 flex-1 rounded-xl border border-line font-display uppercase" onClick={() => setPanel("signal")}>
                    Back
                  </button>
                </div>
              </>
            ) : null}
            {panel === "signal" ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl uppercase tracking-wide">Signal</h2>
                  <button type="button" className="min-h-11 rounded-lg px-3 text-sm text-muted" onClick={() => setPanel("none")}>
                    Close
                  </button>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-raised px-3 py-2">
                    <dt className="text-xs text-muted">Lifetime</dt>
                    <dd className="font-display tabular-nums">{formatCredits(sim.lifetime)}</dd>
                  </div>
                  <div className="rounded-lg bg-raised px-3 py-2">
                    <dt className="text-xs text-muted">Raider kills</dt>
                    <dd className="font-display tabular-nums">{sim.kills}</dd>
                  </div>
                  <div className="rounded-lg bg-raised px-3 py-2">
                    <dt className="text-xs text-muted">Best sortie</dt>
                    <dd className="font-display tabular-nums">{sim.bestSortie}</dd>
                  </div>
                  <div className="rounded-lg bg-raised px-3 py-2">
                    <dt className="text-xs text-muted">Forge mark</dt>
                    <dd className="font-display tabular-nums">×{forgeMark().toFixed(1)}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted">Open frequencies</p>
                <div className="mt-2 flex flex-col gap-2">
                  <button type="button" disabled={sim.redeemed.has("SLAG")} className="min-h-12 rounded-xl border border-line bg-raised px-3 text-left disabled:opacity-50" onClick={() => redeem("SLAG")}>
                    <span className="font-display uppercase">SLAG</span>
                    <span className="mt-0.5 block text-xs text-muted">{sim.redeemed.has("SLAG") ? "Used" : "Stipend · +500"}</span>
                  </button>
                  <button type="button" disabled={sim.redeemed.has("KILN")} className="min-h-12 rounded-xl border border-line bg-raised px-3 text-left disabled:opacity-50" onClick={() => redeem("KILN")}>
                    <span className="font-display uppercase">KILN</span>
                    <span className="mt-0.5 block text-xs text-muted">{sim.redeemed.has("KILN") ? "Used" : "Double yield for 90 seconds"}</span>
                  </button>
                  <button type="button" disabled={sim.redeemed.has("ORBIT") || sim.reforges < 1} className="min-h-12 rounded-xl border border-line bg-raised px-3 text-left disabled:opacity-50" onClick={() => redeem("ORBIT")}>
                    <span className="font-display uppercase">ORBIT</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {sim.redeemed.has("ORBIT") ? "Used" : sim.reforges < 1 ? "Reforge once to unlock · +5,000" : "Dividend · +5,000"}
                    </span>
                  </button>
                </div>
                <button type="button" className="mt-4 min-h-12 w-full rounded-xl border border-line text-sm text-muted" onClick={() => setPanel("wipe")}>
                  Abandon citadel
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
