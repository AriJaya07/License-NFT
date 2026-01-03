"use client";

import Marketplace from "@/src/components/Marketplace";
import { useMyNFTRead } from "../src/hooks/useReadContract";

export default function Home() {
  const { data: totalSupply } = useMyNFTRead();

  return (
    <div className="">
      <h1 className="text-2xl font-bold">NFT Marketplace</h1>
      <p className="mt-2 text-gray-600">
        Total Minted NFTs: {totalSupply?.toString() ?? "-"}
      </p>
      <Marketplace />
    </div>
  );
}
