"use client"

import { useDetailMarketplaceRead } from "@/src/hooks/useReadContract";
import { ADDRESSES, MarketplaceAbi } from "@/src/utils/contracts";
import { useParams } from "next/navigation";
import { useWriteContract } from "wagmi";

export default function ListingPage() {
  const { id } = useParams();
  const listingId = BigInt(id as string);

  const { data: listing } = useDetailMarketplaceRead({ listingId });

  const { writeContractAsync } = useWriteContract();

  async function buy() {
    await writeContractAsync({
      address: ADDRESSES.marketplace,
      abi: MarketplaceAbi,
      functionName: "buyNFT",
      args: [listingId],
      value: listing?.price,
    });
  }

  console.log(listing, "pPPPPO")

  return (
    <div className="">
      <h2 className="text-xl font-semibold">Listing #{id}</h2>
      <button onClick={buy} className="btn-primary mt-4">
        Buy NFT
      </button>
    </div>
  );
}
