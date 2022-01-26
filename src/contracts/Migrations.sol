// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;  //truffle config version "^0.8.0"

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;

  modifier restricted() {  //restriction takes in two values
    require(
      msg.sender == owner,  //smart contract restriction for the sender to be the owner
      "This function is restricted to the contract's owner!"  // if restriction is false
    );
    _;  //continue running the function
  }

  //sending migration out 
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }


  //update smart contract migrations
  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);  //grab the Migrations contract from line 4 and make it a new Migrations route
    upgraded.setCompleted(last_completed_migration); //set the new migration by using setCompleted from line 17 and set the last completed migration from line 6
  }
}
