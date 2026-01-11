import { normalizeIpfs } from "../utils/common";
import { Listing } from "../utils/contracts";


export async function fetchTokenImage(listing: Listing): Promise<string | null> {
  const tokenId = listing.tokenId.toString();

  // 1. Fetch tokenURI
  const res = await fetch("/api/get-token-uri", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nftContract: listing.nftContract,
      tokenId,
    }),
  });

  const result = await res.json();
  if (!result?.tokenURI) return null;

  const tokenURI = normalizeIpfs(result.tokenURI);

  // 2. If metadata JSON, fetch metadata
  if (tokenURI.includes(".json")) {
    const metaRes = await fetch(tokenURI);
    const metadata = await metaRes.json();

    if (!metadata?.image) return null;
    return normalizeIpfs(String(metadata.image));
  }

  // 3. Direct image
  return tokenURI;
}
