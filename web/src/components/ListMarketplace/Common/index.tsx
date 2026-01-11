import Link from "next/link";
import { formatEther } from "viem";

import { XCircle, RefreshCw, ImagePlus, CheckCircle } from "lucide-react";

export const MarketplaceLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );
};

export const MarketplaceEmpty = ({
  onRefresh,
  onReset,
}: {
  onRefresh: () => void;
  onReset: () => void;
}) => {
  return (
    <div className="bg-white p-10 rounded-2xl shadow text-center text-black">
      <ImagePlus className="mx-auto text-gray-400" size={48} />
      <p className="mt-4 font-bold">No listings found</p>

      <div className="mt-5 flex justify-center gap-3">
        <button onClick={onRefresh} className="px-4 py-2 border rounded-xl">
          <RefreshCw size={16} />
        </button>
        <button onClick={onReset} className="px-4 py-2 border rounded-xl">
          Reset
        </button>
      </div>
    </div>
  );
};

export const MarketplaceError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border shadow-xl">
        <div className="flex gap-3">
          <XCircle className="text-red-600" />
          <div>
            <p className="font-bold">Failed to load listings</p>
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarketplaceHeader = ({ onRefresh }: { onRefresh: () => void }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h2 className="text-4xl font-bold text-indigo-600">NFT Marketplace</h2>
        <p className="text-gray-600">Browse listed NFTs</p>
      </div>

      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-black"
      >
        <RefreshCw size={18} />
        Refresh
      </button>
    </div>
  );
};

export const MarketplaceCard = ({
  listing,
  image,
}: {
  listing: any;
  image?: string;
}) => {
  const tokenId = listing.tokenId.toString();
  const price = formatEther(listing.price);

  return (
    <Link href={`/listing/${tokenId}`} className="group">
      <div className="bg-white rounded-2xl border shadow overflow-hidden">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {image ? (
            <img src={image} className="object-cover w-full h-full" />
          ) : (
            <ImagePlus className="text-gray-400" size={48} />
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between">
            <p className="font-bold">#{tokenId}</p>
            <p className="font-bold text-indigo-600">{price} ETH</p>
          </div>

          <div className="mt-2 text-sm flex items-center gap-2">
            {listing.active ? (
              <CheckCircle className="text-green-600" size={14} />
            ) : (
              <XCircle className="text-red-600" size={14} />
            )}
            {listing.active ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    </Link>
  );
};