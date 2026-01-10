"use client";

import {
  ADDRESSES,
  Listing,
  MarketplaceAbi,
  MyNFTAbi,
} from "@/src/utils/contracts";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";

export const useMyNFTRead = () => {
  const { data } = useReadContract({
    address: ADDRESSES.myNFT,
    abi: MyNFTAbi,
    functionName: "totalSupply",
  });

  return {
    data,
  };
};

export const useListMarketplaceRead = () => {
  type ListingWithId = Omit<Listing, "price" | "tokenId"> & {
    tokenId: string;
    price: bigint;
  };

  const [listings, setListings] = useState<any[]>([]);

  const { data, isLoading, isError, refetch } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getAllListings",
  });

  useEffect(() => {
    if (data) {
      console.log(data, "DATASS");
      const listingsData = data.map((listing: any) => ({
        nftContract: listing.nftContract,
        tokenId: listing.tokenId.toString(), // Ensure it's a string for React
        seller: listing.seller,
        price: formatEther(listing.price), // Convert price to ETH
        active: listing.active,
        tokenURI: listing.tokenURI,
      }));
      setListings(listingsData);
    }
  }, [data]);

  return {
    listings,
    isLoading,
    isError,
    refetch,
  };
};

export const useDetailMarketplaceRead = ({ listingId }: { listingId: any }) => {
  const { data } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getListing",
    args: [listingId],
  });

  return {
    data,
  };
};

export const useMarketplaceFee = () => {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getMarketplaceFee", // or 'getMarketplaceFee' if your contract uses that
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
