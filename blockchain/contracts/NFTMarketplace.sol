// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    uint256 public marketplaceFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;

    uint256 private _listingIdCounter;

    mapping(uint256 => Listing) public listings;
    mapping(address => mapping(uint256 => uint256)) public nftToListing;

    event NFTListed(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event NFTSold(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    event ListingCancelled(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    event ListingPriceUpdated(
        uint256 indexed listingId,
        uint256 oldPrice,
        uint256 newPrice
    );

    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor() Ownable() {
        _listingIdCounter = 1;
    }

    // Function to approve marketplace to transfer a specific NFT
    function approveMarketplace(address nftContract, uint256 tokenId) external {
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        IERC721(nftContract).approve(address(this), tokenId); // Approve the marketplace to transfer the token
    }

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this), // Ensure marketplace is approved for this token
            "Marketplace not approved for this token"
        );
        require(nftToListing[nftContract][tokenId] == 0, "NFT already listed");

        uint256 listingId = _listingIdCounter++;

        listings[listingId] = Listing({
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });

        nftToListing[nftContract][tokenId] = listingId;

        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price);

        return listingId;
    }

    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];

        require(listing.active, "Listing not active");
        require(msg.value == listing.price, "Incorrect payment amount");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");

        require(
            IERC721(listing.nftContract).ownerOf(listing.tokenId) ==
                listing.seller,
            "Seller no longer owns NFT"
        );

        listing.active = false;
        nftToListing[listing.nftContract][listing.tokenId] = 0;

        uint256 fee = (listing.price * marketplaceFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;

        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );

        (bool sellerSuccess, ) = payable(listing.seller).call{
            value: sellerAmount
        }("");
        require(sellerSuccess, "Seller payment failed");

        emit NFTSold(
            listingId,
            listing.nftContract,
            listing.tokenId,
            listing.seller,
            msg.sender,
            listing.price
        );
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];

        require(listing.active, "Listing not active");
        require(
            msg.sender == listing.seller || msg.sender == owner(),
            "Not authorized"
        );

        listing.active = false;
        nftToListing[listing.nftContract][listing.tokenId] = 0;

        emit ListingCancelled(listingId, listing.nftContract, listing.tokenId);
    }

    function updateListingPrice(
        uint256 listingId,
        uint256 newPrice
    ) external nonReentrant {
        require(newPrice > 0, "Price must be greater than 0");

        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");

        uint256 oldPrice = listing.price;
        listing.price = newPrice;

        emit ListingPriceUpdated(listingId, oldPrice, newPrice);
    }

    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high");

        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;

        emit MarketplaceFeeUpdated(oldFee, newFee);
    }

    function getMarketplaceFee() external view returns (uint256) {
        return marketplaceFee;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function getListing(
        uint256 listingId
    ) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getAllListings() external view returns (Listing[] memory) {
        uint256 count = _listingIdCounter - 1;
        Listing[] memory items = new Listing[](count);

        for (uint256 i = 1; i <= count; i++) {
            items[i - 1] = listings[i];
        }

        return items;
    }

    function isNFTListed(
        address nftContract,
        uint256 tokenId
    ) external view returns (bool) {
        uint256 listingId = nftToListing[nftContract][tokenId];
        return listingId != 0 && listings[listingId].active;
    }

    receive() external payable {}
}
