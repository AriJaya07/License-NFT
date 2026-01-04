"use client";

import { useListMarketplaceRead } from "@/src/hooks/useReadContract";
import Link from "next/link";
import { formatEther } from "viem";
import { useState, useEffect } from "react";

export default function MarketplacePage() {
  const { listings, isLoading, isError, refetch } = useListMarketplaceRead();

  const [images, setImages] = useState<{ [tokenId: number]: string }>({});

  // Fetch images if the tokenURI points to a metadata file
  useEffect(() => {
    if (listings.length > 0) {
      listings.forEach((listing) => {
        const tokenURI = listing?.tokenURI;

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
                setImages((prevImages) => ({
                  ...prevImages,
                  [listing.tokenId]: metadata.image,
                }));
              }
            })
            .catch((error) => {
              console.error("Failed to fetch metadata:", error);
            });
        }
      });
    }
  }, [listings]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-600 border-t-transparent" />
        <span className="ml-4 text-xl">Loading listings...</span>
      </div>
    );
  }

  // Display error state
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <span className="text-xl">
          Error loading listings. Please try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8">NFT Marketplace</h2>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            No listings available. Check back later!
          </div>
        ) : (
          listings.map((listing) => {
            // Format price from Wei to ETH
            const formattedPrice = formatEther(listing?.price);

            // Check if the image is already available in the state
            const imageUrl = listing?.tokenURI;
            console.log(imageUrl, "IMAGE URL")

            return (
              <Link
                key={listing.tokenId}
                href={`/listing/${listing.tokenId}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all p-6"
              >
                <div className="flex flex-col items-start">
                  {/* Image */}
                  <div className="mb-4 w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl || "https://via.placeholder.com/150"} // Fallback image if no image URL is found
                      alt={`NFT #${listing.tokenId}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Token Info */}
                  <div className="font-semibold text-lg text-gray-900">
                    Token #{listing.tokenId}
                  </div>

                  {/* Price */}
                  <div className="mt-2 text-sm text-gray-700">
                    Price: <b>{formattedPrice} ETH</b>
                  </div>

                  {/* Seller Info */}
                  <div className="mt-2 text-xs text-gray-500">
                    Seller:{" "}
                    <span className="text-sm font-semibold text-blue-500">
                      {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                    </span>
                  </div>

                  {/* Listing Status */}
                  <div
                    className={`mt-2 text-xs font-semibold ${
                      listing.active ? "text-green-600" : "text-red-600"
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
