export type Address = `0x${string}`;

export const ADDRESSES = {
  myNFT: process.env.NEXT_PUBLIC_MYNFT_ADDRESS as Address,
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as Address,
} as const;

function assertEnv() {
  if (!ADDRESSES.myNFT) throw new Error("Missing NEXT_PUBLIC_MYNFT_ADDRESS");
  if (!ADDRESSES.marketplace)
    throw new Error("Missing NEXT_PUBLIC_MARKETPLACE_ADDRESS");
}
assertEnv();

// Minimal ABI MyNFT (hanya yg dipakai di UI)
export const MyNFTAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setApprovalForAll",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Minimal ABI Marketplace
export const MarketplaceAbi = [
  {
    type: "function",
    name: "listNFT",
    stateMutability: "nonpayable",
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }], // listingId
  },
  {
    type: "function",
    name: "buyNFT",
    stateMutability: "payable",
    inputs: [{ name: "listingId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getListing",
    stateMutability: "view",
    inputs: [{ name: "listingId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "nftContract", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "seller", type: "address" },
          { name: "price", type: "uint256" },
          { name: "active", type: "bool" },
        ],
      },
    ],
  },
] as const;


export type Listing = {
    nftContract: Address;
    tokenId: bigint;
    seller: Address;
    price: bigint;
    active: boolean;
}