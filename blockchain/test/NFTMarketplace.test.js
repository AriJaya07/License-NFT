import { expect } from "chai";
import hre from "hardhat";

describe("NFTMarketplace", function () {
  let marketplace;
  let nft;
  let owner;
  let seller;
  let buyer;
  let addr1;

  beforeEach(async function () {
    [owner, seller, buyer, addr1] = await hre.ethers.getSigners();

    // Deploy NFT contract
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    nft = await MyNFT.deploy();
    await nft.waitForDeployment();

    // Deploy Marketplace contract
    const NFTMarketplace = await hre.ethers.getContractFactory(
      "NFTMarketplace"
    );
    marketplace = await NFTMarketplace.deploy();
    await marketplace.waitForDeployment();

    // Owner mints NFTs to seller (owner is the contract owner who can mint)
    await nft.connect(owner).mint(seller.address, "QmTestHash1");
    await nft.connect(owner).mint(seller.address, "QmTestHash2");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should set initial marketplace fee to 2.5%", async function () {
      expect(await marketplace.marketplaceFee()).to.equal(250);
    });

    it("Should return marketplace fee via getMarketplaceFee", async function () {
      const fee = await marketplace.getMarketplaceFee();
      expect(fee).to.equal(250);
    });
  });

  describe("Listing NFTs", function () {
    it("Should list NFT successfully", async function () {
      const price = hre.ethers.parseEther("1");

      // Seller approves marketplace for tokenId 0
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);

      // Seller lists NFT
      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price)
      )
        .to.emit(marketplace, "NFTListed")
        .withArgs(1, await nft.getAddress(), 0, seller.address, price);

      const listing = await marketplace.getListing(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.equal(true);
      expect(listing.nftContract).to.equal(await nft.getAddress());
      expect(listing.tokenId).to.equal(0);
    });

    it("should list NFTs and return them in getAllListings", async function () {
      const price1 = hre.ethers.parseEther("1");
      const price2 = hre.ethers.parseEther("2");

      // First NFT
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace
        .connect(seller)
        .listNFT(await nft.getAddress(), 0, price1);

      // Second NFT
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace
        .connect(seller)
        .listNFT(await nft.getAddress(), 1, price2);

      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(2);

      expect(listings[0].nftContract).to.equal(await nft.getAddress());
      expect(listings[0].tokenId).to.equal(0);
      expect(listings[0].price).to.equal(price1);
      expect(listings[0].seller).to.equal(seller.address);
      expect(listings[0].active).to.equal(true);

      expect(listings[1].nftContract).to.equal(await nft.getAddress());
      expect(listings[1].tokenId).to.equal(1);
      expect(listings[1].price).to.equal(price2);
      expect(listings[1].seller).to.equal(seller.address);
      expect(listings[1].active).to.equal(true);
    });

    it("Should fail if not the owner", async function () {
      const price = hre.ethers.parseEther("1");

      await expect(
        marketplace.connect(buyer).listNFT(await nft.getAddress(), 0, price)
      ).to.be.revertedWith("Not the owner");
    });

    it("Should fail if marketplace not approved", async function () {
      const price = hre.ethers.parseEther("1");

      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price)
      ).to.be.revertedWith("Marketplace not approved for this token");
    });

    it("Should fail if price is zero", async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);

      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, 0)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should fail if NFT already listed", async function () {
      const price = hre.ethers.parseEther("1");

      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace
        .connect(seller)
        .listNFT(await nft.getAddress(), 0, price);

      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price)
      ).to.be.revertedWith("NFT already listed");
    });
  });

  describe("Buying NFTs", function () {
    beforeEach(async function () {
      const price = hre.ethers.parseEther("1");
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace
        .connect(seller)
        .listNFT(await nft.getAddress(), 0, price);
    });

    it("Should buy NFT successfully", async function () {
      const price = hre.ethers.parseEther("1");

      await expect(marketplace.connect(buyer).buyNFT(1, { value: price }))
        .to.emit(marketplace, "NFTSold")
        .withArgs(
          1,
          await nft.getAddress(),
          0,
          seller.address,
          buyer.address,
          price
        );

      expect(await nft.ownerOf(0)).to.equal(buyer.address);

      const listing = await marketplace.getListing(1);
      expect(listing.active).to.equal(false);
    });

    it("Should transfer correct amounts with fees", async function () {
      const price = hre.ethers.parseEther("1");
      const fee = (price * 250n) / 10000n; // 2.5%
      const sellerAmount = price - fee;

      const sellerBalanceBefore = await hre.ethers.provider.getBalance(
        seller.address
      );

      await marketplace.connect(buyer).buyNFT(1, { value: price });

      const sellerBalanceAfter = await hre.ethers.provider.getBalance(
        seller.address
      );
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(sellerAmount);
    });

    it("Should fail with incorrect payment", async function () {
      const wrongPrice = hre.ethers.parseEther("0.5");

      await expect(
        marketplace.connect(buyer).buyNFT(1, { value: wrongPrice })
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should fail if seller tries to buy own NFT", async function () {
      const price = hre.ethers.parseEther("1");

      await expect(
        marketplace.connect(seller).buyNFT(1, { value: price })
      ).to.be.revertedWith("Cannot buy your own NFT");
    });

    it("Should fail if listing not active", async function () {
      const price = hre.ethers.parseEther("1");

      await marketplace.connect(buyer).buyNFT(1, { value: price });

      await expect(
        marketplace.connect(addr1).buyNFT(1, { value: price })
      ).to.be.revertedWith("Listing not active");
    });
  });

  // Further test cases for canceling listings, updating price, fee management, etc.
});
