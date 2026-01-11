import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Image,
  Info,
  Loader2,
  Wallet,
  Zap,
} from "lucide-react";
import { Badge, CustomLabel, Input } from "../../UI/Form";
import { Tooltip } from "../../UI/Tooltip";
import { Card } from "../../UI/Card";
import { Button } from "../../UI/Button";
import { copyAddress, truncateAddress } from "@/src/utils/common";
import { useState } from "react";
import { useProfileUser } from "@/src/hooks/useProfileUser";

export default function UserNFT() {
  const {
    isWalletConnected,
    walletAddress,
    network,
    isConnecting,
    contractAddress,
    setContractAddress,
    tokenId,
    setTokenId,
    isVerifying,
    nftVerified,
    nftData,
    price,
    setPrice,
    errors,
    marketplaceFee,
    sellerReceives,
    connectWallet,
    disconnectWallet,
    verifyNFT,
    setNftVerified,
    setNftData,
    setIsApproved,
    setIsListed,
  } = useProfileUser();

  const [copied, setCopied] = useState(false);

  const handleCopyAddress = (address: string) => {
    const result: any = copyAddress(address);
    setCopied(result);
    if (result) {
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
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
                        onClick={() => handleCopyAddress(walletAddress)}
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
                  <CustomLabel htmlFor="contract">Contract Address</CustomLabel>
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
  );
}
