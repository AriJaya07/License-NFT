"use client";

import { useListMarketplaceRead } from "@/src/hooks/useReadContract";
import Link from "next/link";
import { formatEther } from "viem";
import { useState, useEffect, useMemo } from "react";
import { useReadContract } from "wagmi";
import { MyNFTAbi } from "@/src/utils/contracts";
import {
  ImagePlus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Tag,
  Wallet,
} from "lucide-react";

export default function MarketplacePage() {
  const { listings, isLoading, isError, refetch } = useListMarketplaceRead();
  const [images, setImages] = useState<{ [tokenId: string]: string }>({});
  const [query, setQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [sort, setSort] = useState<"new" | "price_low" | "price_high">("new");

  // Fetch tokenURI for each listing
  useEffect(() => {
    if (listings.length > 0) {
      listings.forEach((listing) => {
        const tokenIdStr = listing.tokenId.toString();

        // Skip if already fetched
        if (images[tokenIdStr]) return;

        // Fetch tokenURI from the NFT contract
        fetch("/api/get-token-uri", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nftContract: listing.nftContract,
            tokenId: tokenIdStr,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.tokenURI) {
              const uri = result.tokenURI;

              // If it's metadata JSON (IPFS), fetch it
              if (uri.includes("ipfs://") || uri.includes(".json")) {
                const metadataUrl = uri.replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/"
                );

                fetch(metadataUrl)
                  .then((response) => response.json())
                  .then((metadata) => {
                    if (metadata?.image) {
                      const img = String(metadata.image);
                      const finalImg = img.startsWith("ipfs://")
                        ? img.replace(
                            "ipfs://",
                            "https://gateway.pinata.cloud/ipfs/"
                          )
                        : img;

                      setImages((prev) => ({
                        ...prev,
                        [tokenIdStr]: finalImg,
                      }));
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to fetch metadata:", error);
                  });
              } else {
                // Direct image URL
                const finalUri = uri.startsWith("ipfs://")
                  ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
                  : uri;

                setImages((prev) => ({
                  ...prev,
                  [tokenIdStr]: finalUri,
                }));
              }
            }
          })
          .catch((error) => {
            console.error("Failed to fetch tokenURI:", error);
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = [...listings];

    if (showActiveOnly) data = data.filter((l) => !!l.active);

    if (q) {
      data = data.filter((l) => {
        const token = String(l.tokenId).toLowerCase();
        const seller = String(l.seller || "").toLowerCase();
        return token.includes(q) || seller.includes(q);
      });
    }

    if (sort === "price_low") {
      data.sort((a: any, b: any) => Number(a.price) - Number(b.price));
    } else if (sort === "price_high") {
      data.sort((a: any, b: any) => Number(b.price) - Number(a.price));
    } else {
      // "new" (best effort): higher tokenId first
      data.sort((a: any, b: any) => Number(b.tokenId) - Number(a.tokenId));
    }

    return data;
  }, [listings, query, showActiveOnly, sort]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Loading listings…
            </p>
            <p className="text-sm text-gray-600">Fetching marketplace data</p>
          </div>
        </div>
      </div>
    );
  }

  // Display error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4">
        <div className="bg-white border-2 border-red-200 rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-50 border border-red-200">
              <XCircle className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">
                Failed to load listings
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Please check: <br />
                • Contract address is correct <br />
                • Network/RPC is working <br />• Contract is deployed
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NFT Marketplace
              </h2>
              <p className="text-gray-600 mt-1">
                Browse listed NFTs. Filter, search, and open details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <RefreshCw size={18} className="text-gray-700" />
              <span className="text-sm font-semibold text-gray-800">
                Refresh
              </span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="mt-6 bg-white border border-gray-200 shadow-md rounded-2xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="md:col-span-6">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by tokenId or seller address…"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-black"
                  />
                </div>
              </div>

              {/* Active only toggle */}
              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={() => setShowActiveOnly((v) => !v)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition ${
                    showActiveOnly
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Filter size={18} />
                  <span className="text-sm font-semibold">
                    {showActiveOnly ? "Active only" : "All listings"}
                  </span>
                </button>
              </div>

              {/* Sort */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Tag
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-black"
                  >
                    <option value="new">Newest</option>
                    <option value="price_low">Price: Low → High</option>
                    <option value="price_high">Price: High → Low</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▾
                  </div>
                </div>
              </div>
            </div>

            {/* Result count */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {listings.length}
                </span>{" "}
                listings
              </div>
              {query || !showActiveOnly || sort !== "new" ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setShowActiveOnly(true);
                    setSort("new");
                  }}
                  className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 underline"
                >
                  Reset filters
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mx-auto flex items-center justify-center mb-4">
              <ImagePlus className="text-indigo-600" size={36} />
            </div>
            <p className="text-xl font-bold text-gray-900">No listings found</p>
            <p className="text-sm text-gray-600 mt-2">
              Try changing your filters or refresh the page.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setShowActiveOnly(true);
                  setSort("new");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          /* Listings Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing: any) => {
              // Format price from Wei to ETH
              const formattedPrice = formatEther(listing?.price);

              // Use fetched metadata image
              const img = images[listing.tokenId.toString()] || "";

              const tokenIdStr = listing.tokenId.toString();
              const seller = String(listing?.seller || "");
              const nftContract = String(listing?.nftContract || "");
              const shortAddr =
                seller && seller.length > 10
                  ? `${seller.slice(0, 6)}...${seller.slice(-4)}`
                  : seller || "—";

              const contractShort =
                nftContract && nftContract.length > 10
                  ? `${nftContract.slice(0, 6)}...${nftContract.slice(-4)}`
                  : nftContract || "—";

              return (
                <Link
                  key={tokenIdStr}
                  href={`/listing/${tokenIdStr}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all overflow-hidden">
                    {/* Image */}
                    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                      {img ? (
                        <img
                          src={img}
                          alt={`NFT #${tokenIdStr}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImagePlus className="text-gray-400" size={56} />
                        </div>
                      )}

                      {/* Status pill */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur ${
                            listing.active
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {listing.active ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {listing.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500">Token</p>
                          <p className="text-xl font-extrabold text-gray-900">
                            #{tokenIdStr}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {formattedPrice} ETH
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Wallet size={16} className="text-gray-400" />
                          <span className="font-semibold text-gray-800">
                            Seller:
                          </span>
                          <span className="font-mono">{shortAddr}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Tag size={16} className="text-gray-400" />
                          <span className="font-semibold text-gray-800">
                            Contract:
                          </span>
                          <span className="font-mono">{contractShort}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-5">
                        <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition">
                          View Listing
                          <span className="opacity-80 group-hover:opacity-100 transition">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
