// NFTGrid.tsx
import React, { useMemo, useState } from "react";

type NFT = {
  id: string;
  name: string;
  collection?: string;
  imageUrl: string;
  listed: boolean;
  priceEth?: number;
  lastSaleEth?: number;
  rarityRank?: number;
  chain?: string; // <-- changed
};

type SortKey =
  | "rarity-asc"
  | "rarity-desc"
  | "price-asc"
  | "price-desc"
  | "sale-asc"
  | "sale-desc"
  | "name-asc"
  | "name-desc";

export type NFTGridProps = {
  /** The NFTs to display */
  items: NFT[];
  /** When true, only show NFTs that are listed */
  showOnlyListed?: boolean;
  /** Optional section title */
  title?: string;
  /** Optional empty-state text override */
  emptyText?: string;
  /** Called when a card is clicked */
  onSelect?: (nft: NFT) => void;
  /** If you're loading data, set this to true to show skeletons */
  loading?: boolean;
  /** Optional: number of skeleton cards to show while loading */
  loadingCount?: number;
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function formatEth(x?: number) {
  if (x == null || Number.isNaN(x)) return "—";
  // simple formatting; tweak if you want more precision
  const s = x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(2) : x.toFixed(3);
  return `${s} ETH`;
}

function chainBadge(chain?: NFT["chain"]) {
  if (!chain) return null;
  const map: Record<string, string> = {
    ETH: "bg-slate-900/10 text-slate-900",
    SOL: "bg-purple-600/10 text-purple-700",
    POLY: "bg-indigo-600/10 text-indigo-700",
    BASE: "bg-blue-600/10 text-blue-700",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        map[chain] ?? "bg-slate-900/10 text-slate-900"
      )}
    >
      {chain}
    </span>
  );
}

function ListedPill({ listed }: { listed: boolean }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        listed
          ? "bg-emerald-600/10 text-emerald-700"
          : "bg-slate-500/10 text-slate-700"
      )}
    >
      <span
        className={classNames(
          "h-1.5 w-1.5 rounded-full",
          listed ? "bg-emerald-600" : "bg-slate-500"
        )}
      />
      {listed ? "Listed" : "Unlisted"}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-200/70" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200/70" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200/70" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-7 animate-pulse rounded-lg bg-slate-200/70" />
          <div className="h-7 animate-pulse rounded-lg bg-slate-200/70" />
          <div className="h-7 animate-pulse rounded-lg bg-slate-200/70" />
        </div>
      </div>
    </div>
  );
}

export default function NFTGrid({
  items,
  showOnlyListed = false,
  title = "NFTs",
  emptyText,
  onSelect,
  loading = false,
  loadingCount = 12,
}: NFTGridProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("rarity-asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let base = items;

    if (showOnlyListed) base = base.filter((x) => x.listed);

    if (q) {
      base = base.filter((x) => {
        const hay = `${x.name} ${x.collection ?? ""} ${
          x.chain ?? ""
        }`.toLowerCase();
        return hay.includes(q);
      });
    }

    const cmp = (a: NFT, b: NFT) => {
      const num = (v?: number, fallback = Number.POSITIVE_INFINITY) =>
        v == null || Number.isNaN(v) ? fallback : v;

      switch (sort) {
        case "rarity-asc":
          return num(a.rarityRank) - num(b.rarityRank);
        case "rarity-desc":
          return num(b.rarityRank, -1) - num(a.rarityRank, -1);

        case "price-asc":
          return num(a.priceEth) - num(b.priceEth);
        case "price-desc":
          return num(b.priceEth, -1) - num(a.priceEth, -1);

        case "sale-asc":
          return num(a.lastSaleEth) - num(b.lastSaleEth);
        case "sale-desc":
          return num(b.lastSaleEth, -1) - num(a.lastSaleEth, -1);

        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    };

    return [...base].sort(cmp);
  }, [items, showOnlyListed, query, sort]);

  const empty =
    emptyText ?? (showOnlyListed ? "No listed NFTs found." : "No NFTs found.");

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {loading
              ? "Loading…"
              : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
            {showOnlyListed ? " • listed only" : ""}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, collection, chain…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:shadow-md"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Sort */}
          <div className="w-full md:w-56">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:shadow-md"
            >
              <option value="rarity-asc">Rarity ↑ (rank)</option>
              <option value="rarity-desc">Rarity ↓ (rank)</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="sale-asc">Last sale ↑</option>
              <option value="sale-desc">Last sale ↓</option>
              <option value="name-asc">Name A→Z</option>
              <option value="name-desc">Name Z→A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading
          ? Array.from({ length: loadingCount }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : filtered.map((nft) => (
              <button
                key={nft.id}
                type="button"
                onClick={() => onSelect?.(nft)}
                className={classNames(
                  "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition",
                  "hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
                )}
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />

                  {/* Top badges */}
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                    <ListedPill listed={nft.listed} />
                    {chainBadge(nft.chain)}
                  </div>

                  {/* Subtle gradient for readability */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {nft.name}
                      </div>
                      <div className="truncate text-xs text-slate-600">
                        {nft.collection ?? "—"}
                      </div>
                    </div>

                    {/* Rarity chip */}
                    {nft.rarityRank != null ? (
                      <span className="shrink-0 rounded-lg bg-slate-900/5 px-2 py-1 text-[11px] font-medium text-slate-800">
                        Rank #{nft.rarityRank}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-900/5 p-2">
                      <div className="text-[10px] font-medium text-slate-600">
                        Price
                      </div>
                      <div className="mt-0.5 font-semibold text-slate-900">
                        {nft.listed ? formatEth(nft.priceEth) : "—"}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-900/5 p-2">
                      <div className="text-[10px] font-medium text-slate-600">
                        Last sale
                      </div>
                      <div className="mt-0.5 font-semibold text-slate-900">
                        {formatEth(nft.lastSaleEth)}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-900/5 p-2">
                      <div className="text-[10px] font-medium text-slate-600">
                        Status
                      </div>
                      <div className="mt-0.5 font-semibold text-slate-900">
                        {nft.listed ? "For sale" : "Hold"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover affordance */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-slate-300" />
              </button>
            ))}
      </div>

      {/* Empty state */}
      {!loading && filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mx-auto max-w-md">
            <div className="text-sm font-semibold text-slate-900">
              Nothing here
            </div>
            <div className="mt-1 text-sm text-slate-600">{empty}</div>
            <div className="mt-4 text-xs text-slate-500">
              Try changing your search or sort.
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
