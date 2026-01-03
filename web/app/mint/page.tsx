"use client";

import { ADDRESSES, MyNFTAbi } from "@/src/utils/contracts";
import { useState } from "react";
import { Address, isAddress } from "viem";
import { useWriteContract } from "wagmi";

export default function MintPage() {
  const { writeContractAsync } = useWriteContract();
  const [to, setTo] = useState("");
  const [uri, setUri] = useState("");

  async function mint() {
    if (!isAddress(to)) return alert("Invalid address");
    if (!uri) return alert("Empty URI");

    await writeContractAsync({
      address: ADDRESSES.myNFT,
      abi: MyNFTAbi,
      functionName: "mint",
      args: [to as Address, uri],
    });
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold">Admin Mint</h2>

      <input
        className="input"
        placeholder="To address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        className="input mt-2"
        placeholder="Token URI"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />

      <button onClick={mint} className="btn-primary mt-3">
        Mint NFT
      </button>
    </div>
  );
}
