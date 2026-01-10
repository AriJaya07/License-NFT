"use client";

import { ADDRESSES, MyNFTAbi } from "@/src/utils/contracts";
import { useState } from "react";
import { Address, isAddress } from "viem";
import { useWriteContract } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { Shield, Wallet, Link2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function FormAdmin() {
  const { writeContractAsync } = useWriteContract();
  const [to, setTo] = useState("");
  const [uri, setUri] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  async function mint() {
    if (!isAddress(to)) return toast.error("Invalid address");
    if (!uri) return toast.error("Empty URI");

    const loadingToast = toast.loading("Minting on-chain...");

    try {
      setIsMinting(true);

      await writeContractAsync({
        address: ADDRESSES.myNFT,
        abi: MyNFTAbi,
        functionName: "mint",
        args: [to as Address, uri],
      });

      toast.success("Mint sent! Check your wallet / explorer.", { id: loadingToast });
      setTo("");
      setUri("");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.shortMessage || e?.message || "Mint failed", { id: loadingToast });
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Admin Mint
              </h2>
              <p className="text-gray-600 mt-1">
                Mint NFT directly to the blockchain using a Token URI.
              </p>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 shadow-sm">
            <CheckCircle className="text-green-600" size={18} />
            <span className="text-sm font-medium text-gray-700">
              On-chain minting only (no EmailJS)
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-gray-200">
                <Wallet className="text-primary-700" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Mint Details</p>
                <p className="text-sm text-gray-600">
                  Enter the receiver address and the metadata URI (ipfs:// or https://).
                </p>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6 space-y-5">
            {/* To address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To address
              </label>
              <div className="relative">
                <Wallet
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className={`w-full pl-10 pr-3 py-3 rounded-xl border-2 outline-none transition
                    ${
                      to.length === 0
                        ? "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                        : isAddress(to)
                        ? "border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200"
                        : "border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                    }`}
                  placeholder="0x..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>

              {to.length > 0 && !isAddress(to) && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle size={16} className="mt-0.5" />
                  <span>That doesn’t look like a valid EVM address.</span>
                </div>
              )}

              {to.length > 0 && isAddress(to) && (
                <div className="mt-2 flex items-start gap-2 text-sm text-green-700">
                  <CheckCircle size={16} className="mt-0.5" />
                  <span>Valid address</span>
                </div>
              )}
            </div>

            {/* Token URI */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token URI
              </label>
              <div className="relative">
                <Link2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition"
                  placeholder="ipfs://... or https://..."
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Tip: Use metadata JSON URI (example: <span className="font-semibold">ipfs://Qm...</span>)
              </p>
            </div>

            {/* Action */}
            <button
              onClick={mint}
              disabled={isMinting || !isAddress(to) || !uri}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition
                ${
                  isMinting || !isAddress(to) || !uri
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : "bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                }`}
            >
              {isMinting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Minting...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Mint NFT
                </>
              )}
            </button>
          </div>

          {/* Footer info */}
          <div className="px-6 py-5 border-t border-gray-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900 mb-1">Network</p>
                <p className="text-gray-600">Uses connected wallet network</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900 mb-1">Contract</p>
                <p className="text-gray-600 break-all">{ADDRESSES.myNFT}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900 mb-1">Requirement</p>
                <p className="text-gray-600">Valid address + Token URI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small warning */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-700 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-amber-900">Admin only</p>
              <p className="text-sm text-amber-800">
                Make sure you’re connected with an admin wallet and on the correct network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
