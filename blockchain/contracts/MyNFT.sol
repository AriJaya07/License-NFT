// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    
    uint256 public tokenCounter;

    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    /**
     * @dev Mint a new NFT
     * @param to Address to mint the NFT to
     * @param tokenURI IPFS hash or URI for the NFT metadata
     */
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        uint256 newItemId = tokenCounter;
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        tokenCounter++;

        emit NFTMinted(to, newItemId, tokenURI);

        return newItemId;
    }

    /**
     * @dev Batch mint multiple NFTs
     * @param to Address to mint the NFTs to
     * @param tokenURIs Array of IPFS hashes or URIs
     */
    function batchMint(address to, string[] memory tokenURIs) public onlyOwner returns (uint256[] memory) {
        require(to != address(0), "Cannot mint to zero address");
        require(tokenURIs.length > 0, "Must mint at least one NFT");
        require(tokenURIs.length <= 50, "Cannot mint more than 50 NFTs at once");

        uint256[] memory tokenIds = new uint256[](tokenURIs.length);

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            require(bytes(tokenURIs[i]).length > 0, "Token URI cannot be empty");
            
            uint256 newItemId = tokenCounter;
            _safeMint(to, newItemId);
            _setTokenURI(newItemId, tokenURIs[i]);
            
            tokenIds[i] = newItemId;
            tokenCounter++;

            emit NFTMinted(to, newItemId, tokenURIs[i]);
        }

        return tokenIds;
    }

    /**
     * @dev Returns the base URI for computing tokenURI
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }

    /**
     * @dev Get total supply of minted NFTs
     */
    function totalSupply() public view returns (uint256) {
        return tokenCounter;
    }

    /**
     * @dev Check if a token exists
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return tokenId < tokenCounter;
    }

    /**
     * @dev Burn an NFT (only owner of the NFT can burn)
     */
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can burn");
        _burn(tokenId);
    }
}