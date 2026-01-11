"use client";

import { useState } from "react";

export const getWalletAddress = async () => {
  const [walletAddress, setWalletAddress] = useState();
  // Ensure the window.ethereum is available (MetaMask or another provider)
  if (window.ethereum) {
    try {
      // Request account access if not granted
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // Set the wallet address dynamically
      setWalletAddress(accounts[0]); // Set the first account's address
    } catch (err) {
      console.error("User denied account access", err);
    }
  } else {
    console.error(
      "Ethereum provider not found. Please install MetaMask or another Ethereum provider."
    );
  }

  return {
    walletAddress,
  };
};
