// formatAddress.ts

/**
 * Shortens a wallet address for UI display.
 *
 * Examples:
 * 0x1234567890abcdef1234567890abcdef12345678
 * → 0x1234…5678
 *
 * solana:
 * 4Nd1mKc9Kk8YxK8sY5a6cZrGZpK2x9QmX9wFzP3y8aZ
 * → 4Nd1…y8aZ
 */
export function formatAddress(
  address?: string | null,
  options?: {
    start?: number;
    end?: number;
    separator?: string;
  }
): string {
  if (!address || typeof address !== "string") return "";

  const { start = 4, end = 4, separator = "…" } = options ?? {};

  const trimmed = address.trim();

  // If address is already short or malformed, return as-is
  if (trimmed.length <= start + end) {
    return trimmed;
  }

  return `${trimmed.slice(0, start)}${separator}${trimmed.slice(-end)}`;
}

// src/lib/utils/format.ts

type FormatPriceOptions = {
  decimals?: number;
  symbol?: string;
  fallback?: string;
};

export function formatPrice(
  value?: number | string | bigint | null,
  options?: FormatPriceOptions
): string {
  const { decimals = 4, symbol = "ETH", fallback = "—" } = options ?? {};

  if (value === null || value === undefined) return fallback;

  const num =
    typeof value === "bigint"
      ? Number(value)
      : typeof value === "string"
      ? Number(value)
      : value;

  if (Number.isNaN(num)) return fallback;

  // Trim trailing zeros (e.g. 1.5000 → 1.5)
  const formatted = num.toFixed(decimals).replace(/\.?0+$/, "");

  return `${formatted} ${symbol}`;
}
