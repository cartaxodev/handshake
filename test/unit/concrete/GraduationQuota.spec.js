const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('../mocks/general/MembersMock.js');
const depositScheduleMock = require('../mocks/general/DepositScheduleMock.js');
const HandshakeSuperClassSpec = require("../templates/HandshakeSuperClass/HandshakeSuperClass.spec.js");
const DepositSchedulerSpec = require("./../features/DepositScheduler.spec.js");


/* FIXTURES DEFINITION */

const deployContractNotApprovedFixture = async function () {

    const minApprovalsToAddNewMember = 2;
    const minApprovalsToRemoveMember = 2;
    const minApprovalsToWithdraw = 2;
    const maxWithdrawValue = 5;
    const deadlineControlConfig = {
        _isControlActive: false,
        _dailyFee: 0,
        _weeklyFee: 0,
        _monthlyFee: 0
    }

    const [members, notMember] = await membersMock.getMembers();
    const memberManagers = await membersMock.getMemberManagers();
    const depositSchedule = await depositScheduleMock.getDepositSchedule();
    const withdrawalApprovers = memberManagers;

    const ERC20Contract = await ethers.getContractFactory('ERC20PresetMinterPauser');
    const [erc20TokenOwner] = await ethers.getSigners();
    const erc20Token = await ERC20Contract.connect(erc20TokenOwner).deploy("Rodrigo_Token", "RCMD");
    await erc20Token.deployed();

    await erc20Token.connect(erc20TokenOwner).mint(members[0]._mainAddress, 100);
    await erc20Token.connect(erc20TokenOwner).mint(members[0]._secondaryAddresses[0], 100);
    await erc20Token.connect(erc20TokenOwner).mint(members[1]._mainAddress, 100);
    await erc20Token.connect(erc20TokenOwner).mint(members[2]._mainAddress, 100);
    await erc20Token.connect(erc20TokenOwner).mint(members[3]._mainAddress, 100);
    await erc20Token.connect(erc20TokenOwner).mint(members[4]._mainAddress, 100);

    const GraduationQuotaETH = await ethers.getContractFactory('GraduationQuota_ETH');
    const graduationQuotaETH = await GraduationQuotaETH.deploy("To get funds to graduation party",
                                                                members,
                                                                memberManagers,
                                                                minApprovalsToAddNewMember,
                                                                minApprovalsToRemoveMember,
                                                                deadlineControlConfig,
                                                                depositSchedule,
                                                               withdrawalApprovers,
                                                               minApprovalsToWithdraw, 
                                                               maxWithdrawValue
                                                               );
    await graduationQuotaETH.deployed();

    const GraduationQuotaERC20 = await ethers.getContractFactory('GraduationQuota_ERC20');
    const graduationQuotaERC20 = await GraduationQuotaERC20.deploy("To get funds to graduation party",
                                                                    members,
                                                                    memberManagers,
                                                                    erc20Token.address,
                                                                    minApprovalsToAddNewMember,
                                                                    minApprovalsToRemoveMember,
                                                                    deadlineControlConfig,
                                                                    depositSchedule,
                                                                withdrawalApprovers,
                                                                minApprovalsToWithdraw, 
                                                                maxWithdrawValue
                                                                );
    await graduationQuotaERC20.deployed();

    const concreteContracts = [graduationQuotaETH, graduationQuotaERC20];

    return { concreteContracts, erc20Token, members, notMember, memberManagers, depositSchedule };
}

const contractApprovedFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers, depositSchedule } = await loadFixture(deployContractNotApprovedFixture);

    for (contract of concreteContracts) {
        for (member of members) {
            const memberId = await contract.getMemberId(member._mainAddress);
            await contract.connect(member.signer).approveTheContract(memberId);
        }
    }

    return { concreteContracts, erc20Token, members, notMember, memberManagers, depositSchedule };
}

/* SET THE FIXTURES FOR THIS TEST SCHEDULE */
HandshakeSuperClassSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);

DepositSchedulerSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);                               

/* DESCRIBES TEST SCHEDULE */
describe("GraduationQuota_ETH - HandshakeSuperClass TESTS", HandshakeSuperClassSpec.tests);
describe("GraduationQuota_ETH - DepositScheduler TESTS", DepositSchedulerSpec.tests);