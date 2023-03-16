// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "./BankAccount.sol";

abstract contract Blockable {

    // Funções de bloqueio do contrato por solicitação de x% dos membros
    // Funções de bloqueio do contrato por força maior (ex: decisão judicial) --> Apenas o owner/handshake pode exwcutar

}