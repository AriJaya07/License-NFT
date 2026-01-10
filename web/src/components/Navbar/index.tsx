import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: Brand + Links */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Brand */}
            <Link
              href={"/"}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50 transition"
              aria-label="Homepage"
            >
              <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600" />
              <span className="font-bold text-gray-900 hidden sm:inline">
                NFT
              </span>
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-700">
              <Link
                href={"/profile"}
                className="rounded-xl px-3 py-2 hover:bg-gray-50 hover:text-gray-900 transition"
              >
                My NFTs
              </Link>
              <Link
                href={"/marketplace"}
                className="rounded-xl px-3 py-2 hover:bg-gray-50 hover:text-gray-900 transition"
              >
                Marketplace
              </Link>
              <Link
                href={"/user-submit"}
                className="rounded-xl px-3 py-2 hover:bg-gray-50 hover:text-gray-900 transition"
              >
                Form Submit
              </Link>
              <Link
                href={"/admin"}
                className="rounded-xl px-3 py-2 hover:bg-gray-50 hover:text-gray-900 transition"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Right: Mobile menu + Connect */}
          <div className="flex items-center gap-3">
            {/* Mobile quick links */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href={"/marketplace"}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                Marketplace
              </Link>
              <Link
                href={"/mint"}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-sm hover:shadow-md transition"
              >
                Mint
              </Link>
            </div>

            <div className="shrink-0">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Small screen: secondary nav (scrollable pills) */}
        <div className="md:hidden pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Link
              href={"/"}
              className="whitespace-nowrap text-sm font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition"
            >
              Dashboard
            </Link>
            <Link
              href={"/mint"}
              className="whitespace-nowrap text-sm font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition"
            >
              Mint
            </Link>
            <Link
              href={"my-nft"}
              className="whitespace-nowrap text-sm font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition"
            >
              My NFTs
            </Link>
            <Link
              href={"/list"}
              className="whitespace-nowrap text-sm font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition"
            >
              List
            </Link>
            <Link
              href={"/marketplace"}
              className="whitespace-nowrap text-sm font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
