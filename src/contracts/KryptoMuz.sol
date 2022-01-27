// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract KryptoMuz is ERC721Connector {

    // array to store our nfts
    string [] public kryptoMuz;

    mapping(string => bool) _kryptoMuzExists;

    function mint(string memory _kryptoMuz) public {

        require(!_kryptoMuzExists[_kryptoMuz],
        'Error - kryptoMuz already exists');
        // this is deprecated - uint _id = KryptoMuz.push(_kryptoMuz);
        kryptoMuz.push(_kryptoMuz);
        uint _id = kryptoMuz.length - 1;

        // .push no longer returns the length but a ref to the added element
        _mint(msg.sender, _id);

        _kryptoMuzExists[_kryptoMuz] = true;

    }

    constructor() ERC721Connector('KryptoMuz','KMUZ')
 {}

}


