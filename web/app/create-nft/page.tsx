"use client"

import { RolePopup } from "@/src/components/RolePopup";
import { useAccount } from "wagmi"; // contoh hook wallet

export default function HomePage() {
  const { address } = useAccount(); // wallet user
  const adminWallet = "0xAdminWalletHere"; // ganti dengan wallet adminmu

  return (
    <>
    </>
  );
}
