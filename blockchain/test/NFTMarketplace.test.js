// test/NFTMarketplace.test.js
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
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    marketplace = await NFTMarketplace.deploy();
    await marketplace.waitForDeployment();

    // Owner mints an NFT to seller (owner is the contract owner who can mint)
    await nft.connect(owner).mint(seller.address, "QmTestHash");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should set initial marketplace fee to 2.5%", async function () {
      expect(await marketplace.marketplaceFee()).to.equal(250);
    });
  });

  describe("Listing NFTs", function () {
    it("Should list NFT successfully", async function () {
      const price = hre.ethers.parseEther("1");
      
      // Seller approves marketplace (seller is the NFT owner)
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
    });

    it("Should fail if not the owner", async function () {
      const price = hre.ethers.parseEther("1");
      
      await expect(
        marketplace.connect(buyer).listNFT(await nft.getAddress(), 0, price)
      ).to.be.revertedWith("Not the owner");
    });

    it("Should fail if marketplace not approved", async function () {
      const price = hre.ethers.parseEther("1");
      
      // Don't approve, just try to list
      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price)
      ).to.be.revertedWith("Marketplace not approved");
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
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);
      
      await expect(
        marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price)
      ).to.be.revertedWith("NFT already listed");
    });
  });

  describe("Buying NFTs", function () {
    beforeEach(async function () {
      const price = hre.ethers.parseEther("1");
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);
    });

    it("Should buy NFT successfully", async function () {
      const price = hre.ethers.parseEther("1");
      
      await expect(
        marketplace.connect(buyer).buyNFT(1, { value: price })
      )
        .to.emit(marketplace, "NFTSold")
        .withArgs(1, await nft.getAddress(), 0, seller.address, buyer.address, price);

      expect(await nft.ownerOf(0)).to.equal(buyer.address);
      
      const listing = await marketplace.getListing(1);
      expect(listing.active).to.equal(false);
    });

    it("Should transfer correct amounts with fees", async function () {
      const price = hre.ethers.parseEther("1");
      const fee = (price * 250n) / 10000n; // 2.5%
      const sellerAmount = price - fee;

      const sellerBalanceBefore = await hre.ethers.provider.getBalance(seller.address);
      
      await marketplace.connect(buyer).buyNFT(1, { value: price });
      
      const sellerBalanceAfter = await hre.ethers.provider.getBalance(seller.address);
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

  describe("Canceling Listings", function () {
    beforeEach(async function () {
      const price = hre.ethers.parseEther("1");
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);
    });

    it("Should cancel listing successfully", async function () {
      await expect(marketplace.connect(seller).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(1, await nft.getAddress(), 0);

      const listing = await marketplace.getListing(1);
      expect(listing.active).to.equal(false);
    });

    it("Should fail if not seller or owner", async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(1)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should allow marketplace owner to cancel", async function () {
      await expect(marketplace.connect(owner).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled");
    });
  });

  describe("Updating Listing Price", function () {
    beforeEach(async function () {
      const price = hre.ethers.parseEther("1");
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);
    });

    it("Should update price successfully", async function () {
      const oldPrice = hre.ethers.parseEther("1");
      const newPrice = hre.ethers.parseEther("2");

      await expect(
        marketplace.connect(seller).updateListingPrice(1, newPrice)
      )
        .to.emit(marketplace, "ListingPriceUpdated")
        .withArgs(1, oldPrice, newPrice);

      const listing = await marketplace.getListing(1);
      expect(listing.price).to.equal(newPrice);
    });

    it("Should fail if not the seller", async function () {
      const newPrice = hre.ethers.parseEther("2");

      await expect(
        marketplace.connect(buyer).updateListingPrice(1, newPrice)
      ).to.be.revertedWith("Not the seller");
    });

    it("Should fail if new price is zero", async function () {
      await expect(
        marketplace.connect(seller).updateListingPrice(1, 0)
      ).to.be.revertedWith("Price must be greater than 0");
    });
  });

  describe("Marketplace Fee Management", function () {
    it("Should update marketplace fee", async function () {
      const newFee = 500; // 5%

      await expect(marketplace.updateMarketplaceFee(newFee))
        .to.emit(marketplace, "MarketplaceFeeUpdated")
        .withArgs(250, newFee);

      expect(await marketplace.marketplaceFee()).to.equal(newFee);
    });

    it("Should fail if fee too high", async function () {
      const highFee = 1500; // 15%

      await expect(
        marketplace.updateMarketplaceFee(highFee)
      ).to.be.revertedWith("Fee too high");
    });

    it("Should fail if not owner", async function () {
      await expect(
        marketplace.connect(seller).updateMarketplaceFee(500)
      ).to.be.reverted;
    });
  });

  describe("Fee Withdrawal", function () {
    it("Should withdraw accumulated fees", async function () {
      const price = hre.ethers.parseEther("1");
      
      // List and buy NFT to accumulate fees
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);
      await marketplace.connect(buyer).buyNFT(1, { value: price });

      const ownerBalanceBefore = await hre.ethers.provider.getBalance(owner.address);
      const marketplaceBalance = await hre.ethers.provider.getBalance(await marketplace.getAddress());

      const tx = await marketplace.withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await hre.ethers.provider.getBalance(owner.address);
      
      expect(ownerBalanceAfter).to.equal(
        ownerBalanceBefore + marketplaceBalance - gasUsed
      );
    });

    it("Should fail if no fees to withdraw", async function () {
      await expect(marketplace.withdrawFees()).to.be.revertedWith(
        "No fees to withdraw"
      );
    });

    it("Should fail if not owner", async function () {
      await expect(marketplace.connect(seller).withdrawFees()).to.be.reverted;
    });
  });

  describe("Helper Functions", function () {
    it("Should check if NFT is listed", async function () {
      expect(await marketplace.isNFTListed(await nft.getAddress(), 0)).to.equal(false);

      const price = hre.ethers.parseEther("1");
      await nft.connect(seller).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(seller).listNFT(await nft.getAddress(), 0, price);

      expect(await marketplace.isNFTListed(await nft.getAddress(), 0)).to.equal(true);
    });
  });
});