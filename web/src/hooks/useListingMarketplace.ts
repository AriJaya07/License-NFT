import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchTokenImage } from "../fetcher/fetchTokenUri";
import { Listing } from "../utils/contracts";

export function useListingsView(listings: Listing[]) {
  /* -----------------------------
       UI State
    -------------------------------- */
  const [query, setQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [sort, setSort] = useState<"new" | "price_low" | "price_high">("new");

  /* -----------------------------
       Images via React Query
    -------------------------------- */
  const imageQueries = useQueries({
    queries: listings.map((listing) => ({
      queryKey: ["token-image", listing.nftContract, listing.tokenId],
      queryFn: () => fetchTokenImage(listing),
      enabled: !!listing?.tokenId,
      staleTime: Infinity,
      gcTime: Infinity,
    })),
  });

  /* -----------------------------
       tokenId -> image map
    -------------------------------- */
  const images = useMemo(() => {
    const map: Record<string, string> = {};

    imageQueries.forEach((q, idx) => {
      const tokenId = listings[idx]?.tokenId?.toString();
      if (tokenId && q.data) {
        map[tokenId] = q.data;
      }
    });

    return map;
  }, [imageQueries, listings]);

  /* -----------------------------
       Filtering & Sorting
    -------------------------------- */
  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = [...listings];

    if (showActiveOnly) {
      data = data.filter((l) => !!l.active);
    }

    if (q) {
      data = data.filter((l) => {
        const token = String(l.tokenId).toLowerCase();
        const seller = String(l.seller || "").toLowerCase();
        return token.includes(q) || seller.includes(q);
      });
    }

    if (sort === "price_low") {
      data.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price_high") {
      data.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      data.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
    }

    return data;
  }, [listings, query, showActiveOnly, sort]);

  /* -----------------------------
       Public API
    -------------------------------- */
  return {
    // data
    listings: filteredListings,
    images,

    // state
    query,
    showActiveOnly,
    sort,

    // setters
    setQuery,
    setShowActiveOnly,
    setSort,
  };
}
