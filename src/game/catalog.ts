export type ItemTag = "drop" | "works" | "hull" | "war";

export type Item = {
  id: string;
  name: string;
  blurb: string;
  cost: number;
  /** Credits per second added before multipliers. */
  income: number;
  /** Multiplies all yield when owned. */
  mult?: number;
  /** Short line shown instead of a raw income figure. */
  note?: string;
  tag: ItemTag;
};

export const ITEMS: Item[] = [
  { id: "dropper", name: "Slag Dropper", blurb: "Drips ore onto the deck.", cost: 25, income: 5, tag: "drop" },
  { id: "belt", name: "Ferrite Belt", blurb: "Feeds the vault.", cost: 100, income: 4, tag: "works" },
  { id: "crucible", name: "Crucible", blurb: "Smelts a hotter credit.", cost: 280, income: 0, mult: 1.5, note: "×1.5 yield", tag: "works" },
  { id: "dropper2", name: "Twin Dropper", blurb: "A second spout.", cost: 600, income: 12, tag: "drop" },
  { id: "keel", name: "Keel Ring", blurb: "First structural ring.", cost: 1_200, income: 10, tag: "hull" },
  { id: "siphon", name: "Vault Siphon", blurb: "Collects for you.", cost: 2_200, income: 0, note: "Auto-collect", tag: "works" },
  { id: "refinery", name: "Refinery", blurb: "Cleaner yield.", cost: 4_500, income: 0, mult: 1.55, note: "×1.55 yield", tag: "works" },
  { id: "reactor", name: "Amber Reactor", blurb: "The heart lights up.", cost: 9_000, income: 36, tag: "hull" },
  { id: "dock", name: "Launch Dock", blurb: "Sorties pay more.", cost: 16_000, income: 16, tag: "war" },
  { id: "turrets", name: "Aegis Turrets", blurb: "A ring of guns.", cost: 30_000, income: 42, tag: "war" },
  { id: "cascade", name: "Kiln Cascade", blurb: "Ore never stops.", cost: 55_000, income: 90, tag: "drop" },
  { id: "shell", name: "Panel Shell", blurb: "The shell closes.", cost: 100_000, income: 55, tag: "hull" },
  { id: "lance", name: "Prism Lance", blurb: "A cutting beam.", cost: 190_000, income: 140, tag: "war" },
  { id: "bay", name: "Fleet Bay", blurb: "A heavier skiff.", cost: 360_000, income: 100, tag: "war" },
  { id: "spire", name: "Command Spire", blurb: "See the whole belt.", cost: 700_000, income: 180, tag: "hull" },
  { id: "miner", name: "Belt Miner", blurb: "Chews the asteroid ring.", cost: 1_300_000, income: 320, tag: "drop" },
  { id: "plating", name: "Void Plating", blurb: "Armor against the dark.", cost: 2_400_000, income: 220, tag: "hull" },
  { id: "kiln", name: "Singularity Kiln", blurb: "Doubles the forge.", cost: 4_800_000, income: 0, mult: 2, note: "×2 yield", tag: "works" },
  { id: "crown", name: "Crown Array", blurb: "The citadel is finished.", cost: 9_500_000, income: 700, tag: "hull" },
];

const ITEM_INDEX = new Map(ITEMS.map((item, index) => [item.id, index]));

export function itemById(id: string): Item | undefined {
  const index = ITEM_INDEX.get(id);
  return index === undefined ? undefined : ITEMS[index];
}

export function formatCredits(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const sign = n < 0 ? "-" : "";
  const value = Math.abs(n);
  if (value < 1000) return sign + Math.floor(value).toString();
  const units = ["K", "M", "B", "T"] as const;
  let unit = -1;
  let scaled = value;
  while (scaled >= 1000 && unit < units.length - 1) {
    scaled /= 1000;
    unit += 1;
  }
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return sign + scaled.toFixed(digits) + units[unit];
}
