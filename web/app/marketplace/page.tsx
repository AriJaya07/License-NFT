"use client"

import { useListMarketplaceRead } from "@/src/hooks/useReadContract";
import Link from "next/link";

export default function MarketplacePage() {
  const { listings, isLoading, isError, refetch } = useListMarketplaceRead();

  console.log("marketplace", listings)

  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  if (isError) {
    return <div className="">Error Loading listing</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Marketplace</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length === 0 ? (
          <div className="">No Listing available</div>
        ) : (
          listings.map((listing) => {
            return (
              <Link
                key={listing.tokenId}
                href={`/listing/${listing?.tokenId}`}
                className="border rounded p-4 hover:bg-gray-50"
              >
                <div className="flex flex-col items-start">
                  <div className="font-semibold">Token #{listing?.tokenId}</div>
                  <div className="mt-2 text-sm">
                    Price: {listing?.price} ETH
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Seller: {listing?.seller?.slice(0, 6)}...
                    {listing?.seller.slice(-4)}
                  </div>
                  <div
                    className={`mt-2 text-xs ${
                      listing?.active ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {listing.active ? "Active" : "Inactive"}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
