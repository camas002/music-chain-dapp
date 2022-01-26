// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
    
    /*

    a. nft to point an address
    b. keep track of the token ids
    c. keep track of token owner address token ids
    d. keep track of how many tokens an owner address has
    e. cereate an event that emits a transfer log - contract address,
    where it is being minted to, the id

     */

contract ERC721 {


    mapping(uint256 => address) private _tokenOwner;

    mapping(address => uint256) private _OwnedTokensCount;

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), 'ERC721: minting to the zero address');
        _tokenOwner[tokenId] = to;
        _OwnedTokensCount[to] += 1;
    //     _to = to;
    //     _tokenId=tokenId;

    //     return _mint();
    //
     }
    }

