// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./../templates/HandshakeSuperClass.sol";

pragma solidity ^0.8.17;

contract FeatureProxy is ERC1967Proxy {

    address private _featureLogicAddress;

    constructor (address _logic, bytes memory _data) ERC1967Proxy(_logic, _data) {
        _featureLogicAddress = _logic;
    }

    function _implementation() internal view override returns (address) {
        return _featureLogicAddress;
    }

    //TODO: Verificar se tem como testar se o parâmetro é uma instância de determinada classe/contrato

}