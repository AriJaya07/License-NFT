"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/src/components/UI/Card";
import { Shield } from "lucide-react";
import NotAdmin from "@/src/components/AdminSubmit/NotAdmin";
import FormAdmin from "./FormAdmin";

const ADMIN_WALLET = (
  process.env.NEXT_PUBLIC_ADMIN_WALLET ??
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
).toLowerCase();

export default function AdminSubmit() {
  const { address, isConnected } = useAccount();

  const isAdmin = useMemo(() => {
    if (!address) return false;
    return address.toLowerCase() === ADMIN_WALLET;
  }, [address]);

  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    if (isConnected && !isAdmin) {
      setShowBlocked(true);
    } else {
      setShowBlocked(false);
    }
  }, [isConnected, isAdmin]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4">
        <Card className="max-w-md w-full p-8 text-center shadow-xl border border-gray-200">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <Shield className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Only</h1>
          <p className="mt-2 text-gray-600">
            Please connect your wallet to check admin access.
          </p>
          <div className="mt-6 text-xs text-gray-500">
            ADMIN_WALLET: <span className="break-all">{ADMIN_WALLET}</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <NotAdmin
        showBlocked={showBlocked}
        address={address}
        setShowBlocked={setShowBlocked}
        adminWallet={ADMIN_WALLET}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 shadow-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-3 rounded-2xl">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm">
                You are logged in as admin wallet.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-900">
              <span className="font-semibold break-all">
                {address?.toLowerCase()}
              </span>
            </p>
          </div>

          <FormAdmin />
        </Card>
      </div>
    </div>
  )
}