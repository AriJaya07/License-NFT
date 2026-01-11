"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/UI/Button";
import { Card } from "@/src/components/UI/Card";
import { Input, CustomLabel, Badge } from "@/src/components/UI/Form";
import { Tooltip } from "@/src/components/UI/Tooltip";
import { Alert } from "@/src/components/UI/Alert";

import {
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  Image,
  ShieldCheck,
  Tag,
  ArrowRight,
  Info,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Zap,
  Globe,
  ExternalLink,
} from "lucide-react";

// Step Indicator Component
interface StepIndicatorProps {
  currentStep: number;
}
const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Connect", icon: Wallet },
    { id: 2, label: "Select NFT", icon: Image },
    { id: 3, label: "Approve", icon: ShieldCheck },
    { id: 4, label: "List", icon: Tag },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-sm font-medium transition-colors ${
                currentStep >= step.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${
                currentStep > step.id
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500"
                  : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Toast Notification Component
interface ToastProps {
  show: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({
  show,
  type,
  title,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300 ${
        !show ? "animate-out slide-out-to-top-2 fade-out" : ""
      }`}
    >
      <Alert type={type} title={title} message={message} className="my-4" />
    </div>
  );
};

// Transaction Modal Component
interface TransactionModalProps {
  show: boolean;
  status: "loading" | "success" | "error";
  title: string;
  message: string;
  txHash: string;
  onClose: () => void;
}
const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  status,
  title,
  message,
  txHash,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-2 border-primary/20">
        <div className="pt-6 text-center">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center animate-pulse">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4">{message}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Waiting for confirmation...</span>
              </div>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4">{message}</p>
              {txHash && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Transaction Hash
                  </p>
                  <code className="text-xs text-foreground break-all">
                    {txHash}
                  </code>
                </div>
              )}
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500"
              >
                Continue
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-4">{message}</p>
              <Button onClick={onClose} variant="primary" className="w-full">
                Try Again
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

// Main Component
const NFTMarketplaceListing: React.FC = () => {
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
  const [toast, setToast] = useState<any>({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [modal, setModal] = useState<any>({
    show: false,
    status: "",
    title: "",
    message: "",
    txHash: "",
  });
  const [copied, setCopied] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<any>({});

  // Calculate fees
  const marketplaceFee = price
    ? (parseFloat(price) * 0.025).toFixed(4)
    : "0.0000";
  const sellerReceives = price
    ? (parseFloat(price) * 0.975).toFixed(4)
    : "0.0000";

  // Update current step based on state
  useEffect(() => {
    if (isListed) setCurrentStep(4);
    else if (isApproved) setCurrentStep(4);
    else if (nftVerified) setCurrentStep(3);
    else if (isWalletConnected) setCurrentStep(2);
    else setCurrentStep(1);
  }, [isWalletConnected, nftVerified, isApproved, isListed]);

  // Mock wallet connection
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

  // Validate contract address
  const validateContractAddress = (address: string) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  // Mock NFT verification
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

    // Mock NFT data
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

  // Validate price
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

  // Mock listing
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

  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    message: string
  ) => {
    setToast({ show: true, type, title, message });
  };

  const truncateAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-indigo-500" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                NFT Marketplace
              </h1>
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              List your NFTs for sale in just a few simple steps. Connect your
              wallet, verify ownership, and start selling.
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />

          <div className="grid gap-6">
            {/* Wallet Connection Section */}
            <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 shadow-lg">
              <div className="bg-gradient-to-r from-indigo-600/10 to-blue-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg">Wallet Connection</h2>
                      <p>Connect your wallet to get started</p>
                    </div>
                  </div>
                  {isWalletConnected && (
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pt-6">
                {!isWalletConnected ? (
                  <Button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {walletAddress.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-foreground">
                            {truncateAddress(walletAddress)}
                          </span>

                          <Tooltip
                            content={copied ? "Copied!" : "Copy address"}
                            contentClassName="max-w-xs"
                          >
                            <button
                              onClick={copyAddress}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe className="w-3 h-3 text-emerald-500" />
                          <span className="text-sm text-muted-foreground">
                            {network}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={disconnectWallet}
                      className="shrink-0"
                    >
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* NFT Selection Section */}
            <Card
              className={`overflow-hidden border-2 transition-all duration-300 shadow-lg ${
                !isWalletConnected
                  ? "opacity-60 pointer-events-none"
                  : "hover:border-primary/30"
              }`}
            >
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg">Select NFT</h2>
                      <p>Enter your NFT details to verify ownership</p>
                    </div>
                  </div>
                  {nftVerified && (
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CustomLabel htmlFor="contract">
                          Contract Address
                        </CustomLabel>
                        <Tooltip
                          content="The Ethereum address of the NFT smart contract (starts with 0x)"
                          contentClassName="max-w-xs"
                        >
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </Tooltip>
                      </div>
                      <Input
                        id="contract"
                        placeholder="0x..."
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className={
                          errors.contractAddress
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                        disabled={nftVerified}
                      />
                      {errors.contractAddress && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.contractAddress}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CustomLabel htmlFor="tokenId">Token ID</CustomLabel>
                        <Tooltip
                          content="The unique identifier of your NFT within the collection"
                          contentClassName="max-w-xs"
                        >
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </Tooltip>
                      </div>
                      <Input
                        id="tokenId"
                        type="number"
                        placeholder="Enter token ID"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        className={
                          errors.tokenId
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                        disabled={nftVerified}
                      />
                      {errors.tokenId && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.tokenId}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CustomLabel htmlFor="price">Listing Price</CustomLabel>
                        <Tooltip
                          content="Set the price you want to sell your NFT for"
                          contentClassName="max-w-xs"
                        >
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </Tooltip>
                      </div>
                      <Input
                        id="price"
                        type="number"
                        step="0.001"
                        min="0.001"
                        placeholder="Price in ETH"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={
                          errors.price
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.price}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Marketplace Fee (2.5%)
                        </span>
                        <span className="font-mono text-foreground">
                          -{marketplaceFee} ETH
                        </span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-foreground">
                            You Receive
                          </span>
                          <span className="font-mono font-bold text-emerald-500">
                            {sellerReceives} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                    {!nftVerified ? (
                      <Button
                        onClick={verifyNFT}
                        disabled={isVerifying || !contractAddress || !tokenId}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Verify Ownership
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNftVerified(false);
                          setNftData(null);
                          setIsApproved(false);
                          setIsListed(false);
                          setPrice("");
                        }}
                        className="w-full"
                      >
                        Select Different NFT
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {nftData ? (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
                        <div className="relative bg-card rounded-xl overflow-hidden border shadow-xl">
                          <img
                            src={nftData.image}
                            alt={nftData.name}
                            className="w-48 h-48 object-cover"
                          />
                          <div className="p-3">
                            <p className="font-semibold text-foreground truncate">
                              {nftData.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {nftData.collection}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-64 rounded-xl bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                        <Image className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">NFT Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Toast Notification */}
        <Toast
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />

        {/* Transaction Modal */}
        <TransactionModal
          show={modal.show}
          status={modal.status}
          title={modal.title}
          message={modal.message}
          txHash={modal.txHash}
          onClose={() => setModal({ ...modal, show: false })}
        />
      </div>
    </div>
  );
};

export default NFTMarketplaceListing;
