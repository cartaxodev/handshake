// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

/* STRUCTS */

    struct Member {
        uint _id; //This is a member ID valid only into the contract scope
        string _login;
        address _mainAddress;
        address[] _secondaryAddresses;
    }

    struct MemberProposal {
        uint _id;
        ProposalType _proposalType;
        Member _affectedMember;
        Member[] _approvals;
    }

    enum ProposalType {
        INCLUSION,
        EXCLUSION
    }

    struct Deposit {
        uint _id;
        address _from;
        uint _value;  
        uint _depositTimestamp;
    }

    struct Withdrawal {
        uint _id;
        address _to;
        uint _value;
        uint _withdrawalTimestamp;
    }

    enum AllowedTokens {
        ETH,
        ERC20
    }