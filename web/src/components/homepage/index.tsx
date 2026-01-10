import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Palette,
  Wallet,
  Tag,
} from "lucide-react";
import { Button } from "@/src/components/UI/Button";
import { Card } from "@/src/components/UI/Card";

interface HomepageProps {
  totalSupply?: bigint;
  setIsCreateNFT: () => void;
}

export default function Homepage({
  totalSupply,
  setIsCreateNFT,
}: HomepageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Sparkles size={20} />
              <span className="text-sm font-medium">
                Welcome to the Future of Digital Art
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover, Collect, and Sell
              <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Extraordinary NFTs
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto">
              The world's first and largest digital marketplace for crypto
              collectibles and non-fungible tokens
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-gray-100"
                >
                  <Palette size={20} /> Explore NFTs <ArrowRight size={20} />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={setIsCreateNFT}
                className="border-white text-white hover:bg-white hover:text-primary-700"
              >
                <Zap size={20} /> Create NFT
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">
                  {totalSupply?.toString() || "0"}
                </p>
                <p className="text-gray-200">Total NFTs</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">2.5%</p>
                <p className="text-gray-200">Marketplace Fee</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-gray-200">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Ethereum with security and transparency at its core
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8 text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Set up your wallet</h3>
              <p className="text-gray-600">
                Once you've set up your wallet of choice, connect it by clicking
                the wallet icon in the top right corner.
              </p>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Create your NFT</h3>
              <p className="text-gray-600">
                Upload your work, add a title and description, and customize
                your NFTs with properties and stats.
              </p>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">List them for sale</h3>
              <p className="text-gray-600">
                Choose between auctions, fixed-price listings, and
                declining-price listings. You choose how you want to sell your
                NFTs.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
