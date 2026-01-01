# Blockchain (Hardhat) — NFT + Marketplace

Folder ini berisi smart contract **MyNFT (ERC-721)** dan **NFTMarketplace** yang dibangun menggunakan **Hardhat** + **OpenZeppelin**.

## Fitur Utama
- **MyNFT (ERC-721)**: mint, batch mint, tokenURI, burn (sesuai implementasi)
- **NFTMarketplace**: listing, buy, cancel, update price, fee marketplace, withdraw fee
- Testing menggunakan Hardhat + Chai

---

## Prasyarat
- **Node.js**: disarankan **v18 LTS** (atau minimal v16.20+)
- **npm** (atau yarn)
- Git (opsional)

Cek versi:
```bash
node -v
npm -v
Struktur Folder
powershell
blockchain/
├─ contracts/
│  ├─ MyNFT.sol
│  └─ NFTMarketplace.sol
├─ scripts/
│  ├─ deploy-nft.js
│  ├─ deploy-marketplace.js
│  └─ deploy-all.js
├─ test/
│  ├─ MyNFT.test.js
│  └─ NFTMarketplace.test.js
├─ hardhat.config.js
├─ package.json
└─ .env   (opsional, untuk testnet)
Instalasi (Local)
Masuk ke folder blockchain:

bash
cd blockchain
Install dependencies:

bash
npm install
Penting: gunakan CommonJS (hindari error ESM)
Pastikan package.json TIDAK memiliki:

json
"type": "module"
Jika sebelumnya pernah muncul error ERR_REQUIRE_ESM, pastikan versi dependency kompatibel:

bash
npm i -D hardhat@^2.28.2 @nomicfoundation/hardhat-toolbox@^5.0.0
npm i -D @nomicfoundation/hardhat-network-helpers@^1.1.0
npm dedupe

Compile
bash
npx hardhat compile

Test
Jalankan semua test:

bash
npx hardhat test
Jalankan test tertentu:

bash
npx hardhat test test/MyNFT.test.js
npx hardhat test test/NFTMarketplace.test.js
Gas report (jika plugin tersedia):

bash
REPORT_GAS=true npx hardhat test
Menjalankan Local Blockchain (Hardhat Node)
Terminal 1 — Start node

bash
npx hardhat node
Hardhat akan menampilkan daftar account + private key test.

Terminal 2 — Deploy ke localhost
Buka terminal baru, lalu:

bash
npx hardhat run scripts/deploy-all.js --network localhost
Jika kamu deploy terpisah:

bash
npx hardhat run scripts/deploy-nft.js --network localhost
npx hardhat run scripts/deploy-marketplace.js --network localhost
Setelah deploy, simpan alamat contract yang muncul di terminal (atau tulis ke file deployments/ jika script kamu sudah membuatnya).

Konfigurasi Testnet (Opsional: Sepolia)
1) Buat file .env
Buat blockchain/.env:

env
PRIVATE_KEY=isi_private_key_wallet_testnet
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/XXXX
ETHERSCAN_API_KEY=XXXX

2) Pastikan hardhat.config.js membaca env
Minimal contoh (sesuaikan dengan config kamu):

js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

3) Deploy ke Sepolia
bash
npx hardhat run scripts/deploy-all.js --network sepolia

4) Verify (opsional, jika ada script verify)
Jika kamu punya script verify:

bash
npx hardhat run scripts/verify.js --network sepolia
Perintah Berguna
Bersihkan cache/build:

bash
npx hardhat clean
Reset total (manual):

bash
rm -rf cache artifacts
npx hardhat compile
Troubleshooting
1) ERR_REQUIRE_ESM (toolbox/network-helpers)
Biasanya karena versi hardhat-network-helpers terlalu baru (ESM).
Solusi:

bash
npm i -D @nomicfoundation/hardhat-network-helpers@^1.1.0
npm dedupe
2) Nothing to compile
Tidak ada perubahan pada file contract atau folder contracts/ kosong.
Solusi:

bash
npx hardhat clean
npx hardhat compile
3) Gagal approve saat listing marketplace
Pastikan token benar-benar milik address yang melakukan approve(), dan marketplace sudah di-approve:

approve(marketplace, tokenId) atau

setApprovalForAll(marketplace, true)

4) Test gagal karena revert message berbeda
Pastikan string revert di contract persis sama dengan yang di-assert pada test.

Quick Start (Ringkas)
bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test

# local node
npx hardhat node
# terminal baru:
npx hardhat run scripts/deploy-all.js --network localhost