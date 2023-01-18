// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SwagDogs is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // Auto increment token ID
    Counters.Counter private _tokenIdCounter;

    // Check that the URI has not been minted before.
    mapping(string => uint8) existingURIs;

    constructor() ERC721("SwagDogs", "MTK") {}

    // Sets the URI format to be on IPFS
    function _baseURI() internal pure override returns (string memory) {
        return "https://firebasestorage.googleapis.com/v0/b/wow-antiafk.appspot.com/o/";
    }
    // makes the tokens mintable
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

        function payToMint(address to, string memory uri) public payable returns (uint256) {
        require(existingURIs[uri]!=1, "NFT already minted");
        require(msg.value >= 0.05 ether, "Must have 0 or more Ether.");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[uri] = 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
} 