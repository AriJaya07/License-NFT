"use client";

import { useEffect, useState, useCallback } from "react";
import Homepage from "@/src/components/homepage";
import { useMyNFTRead } from "@/src/hooks/useReadContract";
import { useAccount, useConnect, useDisconnect } from "wagmi"; // Import useConnect here
import { RolePopup } from "@/src/components/RolePopup";

// Put this in .env.local as NEXT_PUBLIC_ADMIN_WALLET=0x...
const ADMIN_WALLET = (process.env.NEXT_PUBLIC_ADMIN_WALLET ?? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").toLowerCase();

export default function Home() {
  const { data: totalSupply } = useMyNFTRead();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect(); // Use `connect` and `connectors`
  const { disconnect } = useDisconnect(); // Added disconnect for future use
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);
  const [isMetaMaskAlertOpen, setIsMetaMaskAlertOpen] = useState(false);

  const openRolePopup = useCallback(() => {
    if (!isConnected || !address) return;
    setIsRolePopupOpen(true);
  }, [isConnected, address]);

  const closeRolePopup = useCallback(() => {
    setIsRolePopupOpen(false);
  }, []);

  // Close the role popup if user disconnects
  useEffect(() => {
    if (!isConnected) setIsRolePopupOpen(false);
  }, [isConnected]);

  // MetaMask detection and connection logic
  useEffect(() => {
    if (!isConnected) {
      if (window.ethereum) {
        // MetaMask is installed, try to connect
        const connectWallet = async () => {
          try {
            await connect({ connector: connectors[0] }); // Attempt connection
          } catch (error: unknown) {
            // TypeScript now knows that 'error' is an unknown type
            if (error instanceof Error) {
              console.error("MetaMask connection failed", error.message);
            } else {
              console.error("Unknown error occurred during connection");
            }
            setIsMetaMaskAlertOpen(true); // Show alert if failed to connect
          }
        };
        connectWallet();
      } else {
        // Show alert if MetaMask is not installed
        setIsMetaMaskAlertOpen(true);
      }
    }
  }, [isConnected, connect, connectors]);

  // Handle MetaMask installation
  const handleInstallMetaMask = () => {
    window.open("https://metamask.io/download.html", "_blank");
    setIsMetaMaskAlertOpen(false); // Close the alert after action
  };

  const handleConnectMetaMask = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(() => {
          setIsMetaMaskAlertOpen(false); // Close the alert if connected
        })
        .catch((error: unknown) => {
          // Handle error if the user denies the connection
          if (error instanceof Error) {
            console.error("MetaMask connection failed", error.message);
          } else {
            console.error("Unknown error occurred during MetaMask connection");
          }
        });
    }
  };

  return (
    <>
      <Homepage totalSupply={totalSupply} setIsCreateNFT={openRolePopup} />

      {/* MetaMask installation or connection alert */}
      {isMetaMaskAlertOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-zinc-900">
              MetaMask Required
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Please install MetaMask to proceed with the application.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={handleInstallMetaMask}
              >
                Install MetaMask
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                onClick={handleConnectMetaMask}
              >
                Connect MetaMask
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Popup */}
      <RolePopup
        walletAddress={address ?? ""}
        adminAddress={ADMIN_WALLET}
        isOpen={isRolePopupOpen}
        onClose={closeRolePopup}
      />
    </>
  );
}
