import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b p-4">
      <div className="flex gap-4 text-sm font-medium">
        <Link href={"/"}>Dashboard</Link>
        <Link href={"/mint"}>Mint</Link>
        <Link href={"my-nft"}>My NFTs</Link>
        <Link href={"/list"}>List</Link>
        <Link href={"/marketplace"}>Marketplace</Link>
      </div>
      <ConnectButton />
    </nav>
  );
}
