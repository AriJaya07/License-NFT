export function toBigIntSafe(v: string): bigint {
  const n = v.trim();
  if (!n) return 0n;
  return BigInt(n);
}
