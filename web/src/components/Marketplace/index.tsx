import {
  ADDRESSES,
  Listing,
  MarketplaceAbi,
  MyNFTAbi,
} from "@/src/utils/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { Address, formatEther, isAddress, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

function toBigIntSafe(v: string): bigint {
  const n = v.trim();
  if (!n) return 0n;
  return BigInt(n);
}

export default function Marketplace() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [lastHash, setLastHash] = useState<`0x${string}` | undefined>();
  const tx = useWaitForTransactionReceipt({ hash: lastHash });

  // Mint state
  const [mintTo, setMintTo] = useState<string>("");
  const [mintUri, setMintUri] = useState<string>("");

  // Approve state
  const [approveTokenId, setApproveTokenId] = useState<string>("0");

  // List state
  const [listTokenId, setListTokenId] = useState<string>("0");
  const [listPriceEth, setListPriceEth] = useState<string>("0.01");

  // Buy state
  const [buyListingId, setBuyListingId] = useState<string>("1");

  const listingIdBI = useMemo(() => toBigIntSafe(buyListingId), [buyListingId]);

  const { data: listingRaw, refetch: refetchListing } = useReadContract({
    address: ADDRESSES.marketplace,
    abi: MarketplaceAbi,
    functionName: "getListing",
    args: [listingIdBI],
    query: { enabled: listingIdBI > 0n },
  });

  const listing = listingRaw as unknown as Listing | undefined;

  const { data: totalSupply } = useReadContract({
    address: ADDRESSES.myNFT,
    abi: MyNFTAbi,
    functionName: "totalSupply",
  });

  async function onMint() {
    if (!isConnected) return alert("Connect wallet dulu!");
    if (!isAddress(mintTo)) return alert("Alamat 'to' tidak valid");
    if (!mintUri.trim()) return alert("Token URI tidak boleh kosong");

    // MyNFT.mint(to, tokenURI) onlyOwner -> gunakan wallet owner contract
    // MyNFT.mint(to, tokenURI) onlyOwner → gunakan wallet owner contract
    const hash = await writeContractAsync({
      address: ADDRESSES.myNFT,
      abi: MyNFTAbi,
      functionName: "mint",
      args: [mintTo as Address, mintUri.trim()],
    });

    setLastHash(hash);
  }

  async function onApprove() {
    if (!isConnected) return alert("Connect wallet dulu");
    const tokenId = toBigIntSafe(approveTokenId);

    const hash = await writeContractAsync({
      address: ADDRESSES.myNFT,
      abi: MyNFTAbi,
      functionName: "approve",
      args: [ADDRESSES.marketplace, tokenId],
    });

    setLastHash(hash);
  }

  async function onList() {
    if (!isConnected) return alert("Connect wallet dulu");
    const tokenId = toBigIntSafe(listTokenId);
    const priceWei = parseEther(listPriceEth || "0");

    const hash = await writeContractAsync({
      address: ADDRESSES.marketplace,
      abi: MarketplaceAbi,
      functionName: "listNFT",
      args: [ADDRESSES.myNFT, tokenId, priceWei],
    });

    setLastHash(hash);
  }

  async function onBuy() {
    if (!isConnected) return alert("Connect wallet dulu");
    if (!listing) return alert("Listing tidak ditemukan. Klik refresh listing");
    if (!listing.active) return alert("Listing tidak aktif");
    const id = toBigIntSafe(buyListingId);

    const hash = await writeContractAsync({
      address: ADDRESSES.marketplace,
      abi: MarketplaceAbi,
      functionName: "buyNFT",
      args: [id],
      value: listing.price,
    });

    setLastHash(hash);
  }

  return (
    <div className="mx-auto max-w-[920px] p-6">
      <h1 className="mb-3 text-[22px] font-bold">
        NFT Marketplace (Local) — Minimal UI
      </h1>

      <div className="mb-4 flex items-center gap-3">
        <ConnectButton />
        <div className="text-xs">
          <div>
            <b>MyNFT</b>: {ADDRESSES.myNFT}
          </div>
          <div>
            <b>Marketplace</b>: {ADDRESSES.marketplace}
          </div>
          <div>
            <b>Total Supply</b>: {totalSupply?.toString?.() ?? "-"}
          </div>
        </div>
      </div>

      {/* TX Status */}
      <section className="mb-4 rounded-[10px] border border-gray-300 p-3">
        <b>Last TX</b>
        <div className="mt-1.5 text-xs">
          <div>hash: {lastHash ?? "-"}</div>
          <div>confirming: {tx.isLoading ? "yes" : "no"}</div>
          <div>success: {tx.isSuccess ? "yes" : "no"}</div>
          {tx.error && (
            <div className="text-red-600">
              error: {String(tx.error.message)}
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Mint */}
        <section className="rounded-xl border border-gray-300 p-4">
          <h2 className="mb-2.5 font-semibold">1) Mint (onlyOwner)</h2>
          <p className="mb-3 text-xs text-gray-600">
            Mint hanya bisa dilakukan wallet owner contract (di local biasanya
            Account #0). Token URI kamu di contract akan jadi: baseURI +
            tokenURI.
          </p>

          <label className="text-xs">To Address</label>
          <input
            value={mintTo}
            onChange={(e) => setMintTo(e.target.value)}
            placeholder="0x..."
            className="mt-1.5 mb-2.5 w-full rounded border border-gray-300 p-2.5"
          />

          <label className="text-xs">
            Token URI (contoh: Qm... atau metadata.json)
          </label>
          <input
            value={mintUri}
            onChange={(e) => setMintUri(e.target.value)}
            placeholder="QmHash..."
            className="mt-1.5 mb-3 w-full rounded border border-gray-300 p-2.5"
          />

          <button
            onClick={onMint}
            className="w-full rounded bg-black p-2.5 text-white hover:bg-gray-800"
          >
            Mint
          </button>
        </section>

        {/* Approve + List */}
        <section className="rounded-xl border border-gray-300 p-4">
          <h2 className="mb-2.5 font-semibold">2) Approve & List</h2>

          <label className="text-xs">Token ID untuk Approve</label>
          <input
            value={approveTokenId}
            onChange={(e) => setApproveTokenId(e.target.value)}
            className="mt-1.5 mb-2.5 w-full rounded border border-gray-300 p-2.5"
          />

          <button
            onClick={onApprove}
            className="mb-3.5 w-full rounded bg-black p-2.5 text-white hover:bg-gray-800"
          >
            Approve Marketplace untuk Token ID
          </button>

          <hr className="my-2.5 border-t border-gray-200" />

          <label className="text-xs">Token ID untuk Listing</label>
          <input
            value={listTokenId}
            onChange={(e) => setListTokenId(e.target.value)}
            className="mt-1.5 mb-2.5 w-full rounded border border-gray-300 p-2.5"
          />

          <label className="text-xs">Price (ETH)</label>
          <input
            value={listPriceEth}
            onChange={(e) => setListPriceEth(e.target.value)}
            className="mt-1.5 mb-3 w-full rounded border border-gray-300 p-2.5"
          />

          <button
            onClick={onList}
            className="w-full rounded bg-black p-2.5 text-white hover:bg-gray-800"
          >
            List NFT
          </button>

          <p className="mt-2.5 text-xs text-gray-600">
            Syarat listing: kamu pemilik token + marketplace sudah di-approve.
          </p>
        </section>

        {/* Buy */}
        <section className="col-span-1 rounded-xl border border-gray-300 p-4 md:col-span-2">
          <h2 className="mb-2.5 font-semibold">3) Buy</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs">Listing ID</label>
              <input
                value={buyListingId}
                onChange={(e) => setBuyListingId(e.target.value)}
                className="mt-1.5 w-full rounded border border-gray-300 p-2.5"
              />
            </div>

            <div className="flex items-end gap-2.5">
              <button
                onClick={() => refetchListing()}
                className="flex-1 rounded border border-gray-300 p-2.5 hover:bg-gray-100"
              >
                Refresh Listing
              </button>
              <button
                onClick={onBuy}
                className="flex-1 rounded bg-black p-2.5 text-white hover:bg-gray-800"
              >
                Buy (send exact ETH)
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs">
            <b>Listing Detail</b>
            <div>active: {listing ? String(listing.active) : "-"}</div>
            <div>tokenId: {listing ? listing.tokenId.toString() : "-"}</div>
            <div>seller: {listing ? listing.seller : "-"}</div>
            <div>
              price: {listing ? `${formatEther(listing.price)} ETH` : "-"}
            </div>
          </div>

          <p className="mt-2.5 text-xs text-gray-600">
            buyNFT() wajib kirim value = price. Kalau kurang/lebih akan revert.
          </p>
        </section>
      </div>

      <footer className="mt-4 text-xs text-gray-500">
        Connected: {isConnected ? address : "-"}
      </footer>
    </div>
  );
}
