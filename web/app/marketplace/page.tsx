"use client";

import { useListMarketplaceRead } from "@/src/hooks/useReadContract";
import Link from "next/link";
import { formatEther } from "viem";
import { useState, useEffect, useMemo } from "react";
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

  const [images, setImages] = useState<{ [tokenId: number]: string }>({});
  const [query, setQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [sort, setSort] = useState<"new" | "price_low" | "price_high">("new");

  // Fetch images if the tokenURI points to a metadata file
  useEffect(() => {
    if (listings.length > 0) {
      listings.forEach((listing) => {
        const tokenURI = listing?.tokenURI;
        if (!tokenURI) return;

        // avoid refetch if already set
        if (images[Number(listing.tokenId)]) return;

        // If tokenURI is a JSON file (metadata), we need to fetch it and extract the image URL
        if (tokenURI && tokenURI.includes("ipfs://")) {
          const metadataUrl = tokenURI.replace(
            "ipfs://",
            "https://gateway.pinata.cloud/ipfs/"
          );

          fetch(metadataUrl)
            .then((response) => response.json())
            .then((metadata) => {
              if (metadata?.image) {
                const img = String(metadata.image);
                const finalImg = img.startsWith("ipfs://")
                  ? img.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
                  : img;

                setImages((prevImages) => ({
                  ...prevImages,
                  [Number(listing.tokenId)]: finalImg,
                }));
              }
            })
            .catch((error) => {
              console.error("Failed to fetch metadata:", error);
            });
        } else {
          // If tokenURI is already an image/http, store it as direct image
          const direct = String(tokenURI);
          const finalDirect = direct.startsWith("ipfs://")
            ? direct.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
            : direct;

          setImages((prevImages) => ({
            ...prevImages,
            [Number(listing.tokenId)]: finalDirect,
          }));
        }
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

  // Display loading state (match admin theme)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
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
                Please try again. If it keeps failing, check your RPC / contract
                config.
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
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
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
                      ? "bg-gradient-to-r from-primary-500 to-purple-600 text-white border-transparent shadow-lg"
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
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
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
                  className="text-sm font-semibold text-primary-700 hover:text-primary-800 underline"
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 mx-auto flex items-center justify-center mb-4">
              <ImagePlus className="text-primary-600" size={36} />
            </div>
            <p className="text-xl font-bold text-gray-900">No listings found</p>
            <p className="text-sm text-gray-600 mt-2">
              Try changing your filters or refresh the page.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition"
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
              // Format price from Wei to ETH (keep your logic)
              const formattedPrice = formatEther(listing?.price);

              // Use fetched metadata image first
              const img =
                images[Number(listing.tokenId)] ||
                (typeof listing?.tokenURI === "string"
                  ? listing.tokenURI.replace(
                      "ipfs://",
                      "https://gateway.pinata.cloud/ipfs/"
                    )
                  : "");

              return (
                <Link
                  key={listing.tokenId}
                  href={`/listing/${listing.tokenId}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all overflow-hidden">
                    {/* Image */}
                    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                      {img ? (
                        // use img tag to avoid next/image domain config issues
                        <img
                          src={img}
                          alt={`NFT #${listing.tokenId}`}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
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
                              ? "bg-green-50/90 text-green-800 border-green-200"
                              : "bg-red-50/90 text-red-800 border-red-200"
                          }`}
                        >
                          {listing.active ? (
                            <>
                              <CheckCircle size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={14} />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>

                      {/* Token badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 border border-gray-200 text-gray-800">
                          <Tag size={14} />
                          Token #{listing.tokenId}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-gray-900 leading-tight">
                            NFT #{listing.tokenId}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Listed by{" "}
                            <span className="font-semibold text-primary-700">
                              {String(listing.seller).slice(0, 6)}...
                              {String(listing.seller).slice(-4)}
                            </span>
                          </p>
                        </div>

                        {/* Price chip */}
                        <div className="shrink-0 text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200">
                            <Wallet size={16} className="text-primary-700" />
                            <span className="text-sm font-bold text-gray-900">
                              {formattedPrice} ETH
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Click to view details
                        </span>
                        <span className="text-sm font-semibold text-primary-700 group-hover:text-primary-800">
                          Open →
                        </span>
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
