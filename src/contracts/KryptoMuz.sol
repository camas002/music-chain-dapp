// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract Kryptomuz is ERC721Connector {


    constructor() ERC721Connector('Kryptomuz', 'KMUZ'){

    }
}