"use client";

import {
  ADDRESSES,
  Listing,
  MarketplaceAbi,
  MyNFTAbi,
} from "@/src/utils/contracts";
import { useEffect, useState } from "react";
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
  const [listings, setListings] = useState<any[]>([]);

  const { data, isLoading, isError, refetch } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getAllListings",
  });

  useEffect(() => {
    if (data) {
      console.log("Raw data from contract:", data);

      // Map the data according to the actual Listing struct from your contract
      // Listing struct: { nftContract, tokenId, seller, price, active }
      const listingsData = data.map((listing: any) => ({
        nftContract: listing.nftContract,
        tokenId: listing.tokenId, // Keep as bigint
        seller: listing.seller,
        price: listing.price, // Keep as bigint, format in UI
        active: listing.active,
        // tokenURI is NOT in the contract - must be fetched separately
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
  const { data, isLoading, isError } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getListing",
    args: [listingId],
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export const useMarketplaceFee = () => {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getMarketplaceFee",
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

// NEW HOOK: Fetch tokenURI from the NFT contract
export const useNFTTokenURI = ({
  nftContract,
  tokenId,
}: {
  nftContract: `0x${string}`;
  tokenId: bigint;
}) => {
  const { data, isLoading, isError } = useReadContract({
    address: nftContract,
    abi: MyNFTAbi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  return {
    tokenURI: data as string | undefined,
    isLoading,
    isError,
  };
};
