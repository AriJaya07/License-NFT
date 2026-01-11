import { useEffect, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";
type ToastState = {
  show: boolean;
  type: ToastType | "";
  title: string;
  message: string;
};

type ModalStatus = "loading" | "success" | "error" | "";
type ModalState = {
  show: boolean;
  status: ModalStatus;
  title: string;
  message: string;
  txHash: string;
};

export function useProfileUser() {
  // Wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("Ethereum Mainnet");
  const [isConnecting, setIsConnecting] = useState(false);

  // NFT state
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [nftVerified, setNftVerified] = useState(false);
  const [nftData, setNftData] = useState<any>(null);

  // Approval state
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Listing state
  const [price, setPrice] = useState("");
  const [isListing, setIsListing] = useState(false);
  const [isListed, setIsListed] = useState(false);

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [modal, setModal] = useState<ModalState>({
    show: false,
    status: "",
    title: "",
    message: "",
    txHash: "",
  });

  // Validation state
  const [errors, setErrors] = useState<any>({});

  // Toast helper (same signature)
  function showToast(type: ToastType, title: string, message: string) {
    setToast({ show: true, type, title, message });
  }

  // Calculate fees (same output)
  const marketplaceFee = useMemo(() => {
    return price ? (parseFloat(price) * 0.025).toFixed(4) : "0.0000";
  }, [price]);

  const sellerReceives = useMemo(() => {
    return price ? (parseFloat(price) * 0.975).toFixed(4) : "0.0000";
  }, [price]);

  // Update current step based on state (same logic)
  useEffect(() => {
    if (isListed) setCurrentStep(4);
    else if (isApproved) setCurrentStep(4);
    else if (nftVerified) setCurrentStep(3);
    else if (isWalletConnected) setCurrentStep(2);
    else setCurrentStep(1);
  }, [isWalletConnected, nftVerified, isApproved, isListed]);

  // Mock wallet connection (same behavior)
  const connectWallet = async () => {
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setWalletAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    setIsWalletConnected(true);
    setIsConnecting(false);
    showToast(
      "success",
      "Wallet Connected",
      "Successfully connected to your wallet"
    );
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setNftVerified(false);
    setNftData(null);
    setIsApproved(false);
    setIsListed(false);
    setPrice("");
    setContractAddress("");
    setTokenId("");
    showToast(
      "info",
      "Wallet Disconnected",
      "Your wallet has been disconnected"
    );
  };

  // Validate contract address (same)
  const validateContractAddress = (address: string) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  // Mock NFT verification (same behavior)
  const verifyNFT = async () => {
    const newErrors: any = {};

    if (!validateContractAddress(contractAddress)) {
      newErrors.contractAddress = "Invalid contract address format";
    }
    if (!tokenId || parseInt(tokenId) < 0) {
      newErrors.tokenId = "Please enter a valid token ID";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock NFT data (same)
    setNftData({
      name: "Cosmic Voyager #" + tokenId,
      collection: "Cosmic Voyagers",
      image: "https://placehold.co/400x400/1a1a2e/eaeaea?text=NFT+" + tokenId,
    });
    setNftVerified(true);
    setIsVerifying(false);
    showToast(
      "success",
      "NFT Verified",
      "Ownership confirmed for token #" + tokenId
    );
  };

  // Validate price (same)
  const validatePrice = () => {
    if (!price || parseFloat(price) <= 0) {
      setErrors((prev: any) => ({
        ...prev,
        price: "Please enter a valid price",
      }));
      return false;
    }
    if (parseFloat(price) < 0.001) {
      setErrors((prev: any) => ({
        ...prev,
        price: "Minimum price is 0.001 ETH",
      }));
      return false;
    }
    setErrors((prev: any) => ({ ...prev, price: null }));
    return true;
  };

  // Mock listing (same behavior)
  const listNFT = async () => {
    if (!validatePrice()) return;

    setModal({
      show: true,
      status: "loading",
      title: "Creating Listing",
      message: "Please confirm the transaction in your wallet...",
      txHash: "",
    });
    setIsListing(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const success = Math.random() > 0.1;

    if (success) {
      setIsListed(true);
      setModal({
        show: true,
        status: "success",
        title: "NFT Listed Successfully! 🎉",
        message: `Your NFT has been listed for ${price} ETH on the marketplace.`,
        txHash:
          "0x" +
          Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(""),
      });
    } else {
      setModal({
        show: true,
        status: "error",
        title: "Listing Failed",
        message: "Transaction was rejected or failed. Please try again.",
        txHash: "",
      });
    }
    setIsListing(false);
  };

  // Return everything with SAME names available to the component
  return {
    // Wallet
    isWalletConnected,
    setIsWalletConnected,
    walletAddress,
    setWalletAddress,
    network,
    setNetwork,
    isConnecting,
    setIsConnecting,

    // NFT
    contractAddress,
    setContractAddress,
    tokenId,
    setTokenId,
    isVerifying,
    setIsVerifying,
    nftVerified,
    setNftVerified,
    nftData,
    setNftData,

    // Approval
    isApproved,
    setIsApproved,
    isApproving,
    setIsApproving,

    // Listing
    price,
    setPrice,
    isListing,
    setIsListing,
    isListed,
    setIsListed,

    // UI
    currentStep,
    setCurrentStep,
    toast,
    setToast,
    modal,
    setModal,

    // Validation
    errors,
    setErrors,

    // Derived
    marketplaceFee,
    sellerReceives,

    // Functions
    connectWallet,
    disconnectWallet,
    validateContractAddress,
    verifyNFT,
    validatePrice,
    listNFT,
    showToast,
  };
}
