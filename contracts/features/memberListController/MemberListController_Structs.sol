// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./../../templates/HandshakeSuperClass_Structs.sol";

/* STRUCTS */

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