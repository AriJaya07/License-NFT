// test/MyNFT.test.js
import { expect } from "chai";
import hre from "hardhat";

describe("MyNFT", function () {
  let myNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    await myNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await myNFT.name()).to.equal("MyNFT");
      expect(await myNFT.symbol()).to.equal("MNFT");
    });

    it("Should start with token counter at 0", async function () {
      expect(await myNFT.tokenCounter()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      const tokenURI = "QmTest123";
      await myNFT.mint(owner.address, tokenURI);

      expect(await myNFT.ownerOf(0)).to.equal(owner.address);
      expect(await myNFT.tokenURI(0)).to.include(tokenURI);
      expect(await myNFT.tokenCounter()).to.equal(1);
    });

    it("Should mint to specified address", async function () {
      const tokenURI = "QmTest456";
      await myNFT.mint(addr1.address, tokenURI);

      expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const tokenURI = "QmTest789";
      await expect(
        myNFT.connect(addr1).mint(addr1.address, tokenURI)
      ).to.be.reverted;
    });

    it("Should mint multiple NFTs with incrementing IDs", async function () {
      await myNFT.mint(owner.address, "QmTest1");
      await myNFT.mint(addr1.address, "QmTest2");
      await myNFT.mint(addr2.address, "QmTest3");

      expect(await myNFT.tokenCounter()).to.equal(3);
      expect(await myNFT.ownerOf(0)).to.equal(owner.address);
      expect(await myNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await myNFT.ownerOf(2)).to.equal(addr2.address);
    });

    it("Should fail to mint to zero address", async function () {
      const tokenURI = "QmTest123";
      await expect(
        myNFT.mint(hre.ethers.ZeroAddress, tokenURI)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should fail to mint with empty URI", async function () {
      await expect(
        myNFT.mint(owner.address, "")
      ).to.be.revertedWith("Token URI cannot be empty");
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint multiple NFTs", async function () {
      const tokenURIs = ["QmTest1", "QmTest2", "QmTest3"];
      const tx = await myNFT.batchMint(addr1.address, tokenURIs);
      await tx.wait();

      expect(await myNFT.tokenCounter()).to.equal(3);
      expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await myNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await myNFT.ownerOf(2)).to.equal(addr1.address);
    });

    it("Should fail batch mint with empty array", async function () {
      await expect(
        myNFT.batchMint(addr1.address, [])
      ).to.be.revertedWith("Must mint at least one NFT");
    });

    it("Should fail batch mint with too many NFTs", async function () {
      const tokenURIs = new Array(51).fill("QmTest");
      await expect(
        myNFT.batchMint(addr1.address, tokenURIs)
      ).to.be.revertedWith("Cannot mint more than 50 NFTs at once");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI with base URI", async function () {
      const tokenURI = "QmTestHash";
      await myNFT.mint(owner.address, tokenURI);

      const fullURI = await myNFT.tokenURI(0);
      expect(fullURI).to.equal(`https://gateway.pinata.cloud/ipfs/${tokenURI}`);
    });

    it("Should fail to get URI for non-existent token", async function () {
      await expect(myNFT.tokenURI(999)).to.be.reverted;
    });
  });

  describe("Helper Functions", function () {
    it("Should return correct total supply", async function () {
      await myNFT.mint(owner.address, "QmTest1");
      await myNFT.mint(addr1.address, "QmTest2");

      expect(await myNFT.totalSupply()).to.equal(2);
    });

    it("Should check if token exists", async function () {
      await myNFT.mint(owner.address, "QmTest1");

      expect(await myNFT.exists(0)).to.equal(true);
      expect(await myNFT.exists(999)).to.equal(false);
    });
  });

  describe("Burning", function () {
    it("Should allow token owner to burn", async function () {
      await myNFT.mint(addr1.address, "QmTest1");

      await expect(myNFT.connect(addr1).burn(0))
        .to.emit(myNFT, "Transfer")
        .withArgs(addr1.address, hre.ethers.ZeroAddress, 0);

      await expect(myNFT.ownerOf(0)).to.be.reverted;
    });

    it("Should fail if non-owner tries to burn", async function () {
      await myNFT.mint(addr1.address, "QmTest1");

      await expect(
        myNFT.connect(addr2).burn(0)
      ).to.be.revertedWith("Only token owner can burn");
    });
  });
});
