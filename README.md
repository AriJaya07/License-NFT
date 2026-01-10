┌──────────────────────────────┐
│ User Wants to Sell Artwork   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ User Sends Email to Admin                │
│  - Image file                            │
│  - Wallet address                       │
│  - Optional description                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Admin Reviews Submission     │
│  - Image quality             │
│  - Copyright / originality   │
│  - Collection rules          │
└──────────────┬───────────────┘
               │
        ┌──────┴────────┐
        │               │
        ▼               ▼
┌──────────────┐   ┌──────────────────────┐
│ Rejected ❌  │   │ Approved ✅           │
│ Notify user │   │ Continue               │
└──────────────┘   └──────────┬───────────┘
                               │
                               ▼
┌──────────────────────────────────────────┐
│ Admin Uploads Data OFF-CHAIN             │
│  - Image → IPFS or HTTPS                 │
│  - Metadata JSON created                │
│    { name, description, image, traits } │
│  - tokenURI = metadata URL              │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Admin (Contract Owner) Mints NFT         │
│  - tokenId generated                    │
│  - tokenURI stored ON-CHAIN (string)    │
│  - NFT minted directly to user wallet   │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ User (or Admin) Lists NFT                │
│  - price set                            │
│  - active = true                        │
│  - listing stored ON-CHAIN              │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Blockchain (Permanent Storage)           │
│                                          │
│ NFT Contract stores:                     │
│  - tokenId                              │
│  - owner                               │
│  - tokenURI (string only)               │
│                                          │
│ Marketplace stores:                      │
│  - seller                               │
│  - price                                │
│  - active                               │
│  - nftContract                          │
│  - tokenId                              │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Frontend Loads Page                      │
│  - readContract(listings)               │
│  - readContract(tokenURI)               │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Frontend Fetches Metadata OFF-CHAIN      │
│  fetch(tokenURI)                         │
│  → JSON                                 │
│   - name                                │
│   - description                         │
│   - image                               │
│   - attributes                          │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Frontend Renders NFT                    │
│  - Image                                │
│  - Name                                 │
│  - Traits                               │
│  - Price                                │
│  - Buy button                           │
└──────────────────────────────────────────┘
