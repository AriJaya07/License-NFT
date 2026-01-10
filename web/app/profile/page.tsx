// src/app/profile/page.tsx
"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
// import Button from '@/src/components/UI/Button';
import NFTGrid from "@/src/components/UI/NFTGrid";
import { User, Wallet, TrendingUp, Copy, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useMyNFTRead } from "@/src/hooks/useReadContract";
import { formatAddress } from "@/src/utils/common";
import { Card } from "@/src/components/UI/Card";

const items = [
  {
    id: "1",
    name: "Ape #1024",
    collection: "Bored Apes",
    imageUrl: "https://picsum.photos/600?1",
    listed: true,
    priceEth: 2.35,
    lastSaleEth: 1.8,
    rarityRank: 120,
    chain: "ETH",
  },
  {
    id: "2",
    name: "Cat #77",
    collection: "Pixel Cats",
    imageUrl: "https://picsum.photos/600?2",
    listed: false,
    lastSaleEth: 0.42,
    rarityRank: 980,
    chain: "BASE",
  },
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { data: totalSupply } = useMyNFTRead();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"owned" | "listed">("owned");

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="p-12 text-center max-w-md">
          <Wallet size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to view your profile and NFT collection.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex items-end gap-6">
                {/* Avatar */}
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 w-32 h-32 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                  <User className="text-white" size={64} />
                </div>

                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    My Profile
                  </h1>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono">
                      {formatAddress(address)}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">NFTs Owned</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">NFTs Listed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">0 ETH</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Floor Price</p>
                <p className="text-2xl font-bold text-gray-900">-- ETH</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("owned")}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === "owned"
                ? "text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Owned
            {activeTab === "owned" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("listed")}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === "listed"
                ? "text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Listed
            {activeTab === "listed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            )}
          </button>
        </div>

        {/* NFT Grid */}
        <NFTGrid
          items={items}
          showOnlyListed={activeTab === "listed"}
          onSelect={(nft) => console.log("Selected:", nft)}
        />
      </div>
    </div>
  );
}
