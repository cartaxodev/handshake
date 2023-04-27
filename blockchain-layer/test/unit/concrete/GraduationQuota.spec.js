const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('../mocks/general/MembersMock.js');
const depositScheduleMock = require('../mocks/general/DepositScheduleMock.js');
const HandshakeSuperClassSpec = require("../templates/HandshakeSuperClass/HandshakeSuperClass.spec.js");
const MemberListControllerSpec = require("./../features/MemberListController.spec.js");
const DepositSchedulerSpec = require("./../features/DepositScheduler.spec.js");
const WithdrawalControllerSpec = require("./../features/WithdrawalController.spec.js");


/* FIXTURES DEFINITION */

const contractTypeSource = "contracts/concrete/GraduationQuota/";
const contractVersion = "v1.0.0";

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

    const GraduationQuotaETH = await ethers.getContractFactory(contractTypeSource + 'GraduationQuota_ETH.sol:GraduationQuota_ETH');
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

    const GraduationQuotaERC20 = await ethers.getContractFactory(contractTypeSource + 'GraduationQuota_ERC20.sol:GraduationQuota_ERC20');
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

    return { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers };
}

const contractApprovedFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers } = await loadFixture(deployContractNotApprovedFixture);

    for (contract of concreteContracts) {
        for (member of members) {
            const memberId = await contract.getMemberId(member._mainAddress);
            await contract.connect(member.signer).approveTheContract(memberId);
        }
    }

    return { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers };
}

const contractWithAllDepositsDoneFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers } = await loadFixture(contractApprovedFixture);
    
    const DepositScheduler_Logic_Factory = await ethers.getContractFactory('DepositScheduler_Logic');

    for (contract of concreteContracts) {

        const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());

        if (await contract.getTokenType() === 0) {
            
            for (member of members) {
                const memberId = await contract.getMemberId(member._mainAddress);

                for (deposit of await depositScheduler.getMemberSchedule(memberId)) {

                    await depositScheduler
                        .connect(member.signer)
                        .payNextDeposit(memberId, {value: 1});
                }
            }
        }
        else {
            for (member of members) {
                const memberId = await contract.getMemberId(member._mainAddress);

                for (deposit of await depositScheduler.getMemberSchedule(memberId)) {

                    await erc20Token
                        .connect(member.signer)
                        .approve(contract.address, 1);

                    await depositScheduler
                        .connect(member.signer)
                        .payNextDeposit(memberId);
                }
            }
        }
    }
    
    return { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers };
}

const proposedWithdrawalsFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers }= await loadFixture(contractWithAllDepositsDoneFixture);

    const WithdrawalController_Logic_Factory = await ethers.getContractFactory('WithdrawalController_Logic');

    for (contract of concreteContracts) {

        const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

        const bob = members[0];
        const bobId = await contract.getMemberId(bob._mainAddress);

        await withdrawalController
            .connect(bob.signer)
            .proposeWithdrawal(bobId, 5, "fixture withdraw 1 - have to me at least 20 characters", bob._mainAddress);

        await withdrawalController
            .connect(bob.signer)
            .proposeWithdrawal(bobId, 5, "fixture withdraw 2 - have to me at least 20 characters", bob._mainAddress);

        await withdrawalController
            .connect(bob.signer)
            .proposeWithdrawal(bobId, 5, "fixture withdraw 3 - have to me at least 20 characters", bob._mainAddress);
    }

    return { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers };
}

const authorizedWithdrawalsFixture =  async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers } = await loadFixture(proposedWithdrawalsFixture);

    const WithdrawalController_Logic_Factory = await ethers.getContractFactory('WithdrawalController_Logic');

    for (contract of concreteContracts) {

        const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

        const alice = members[1];
        const aliceId = await contract.getMemberId(alice._mainAddress);

        await withdrawalController
            .connect(alice.signer)
            .authorizeWithdrawal(aliceId, 0);

        await withdrawalController
            .connect(alice.signer)
            .authorizeWithdrawal(aliceId, 1);
        
        await withdrawalController
            .connect(alice.signer)
            .authorizeWithdrawal(aliceId, 2);
    }

    return { concreteContracts, erc20Token, members, notMember, memberManagers, withdrawalApprovers };
}


/* SET THE FIXTURES FOR THIS TEST SCHEDULE */
HandshakeSuperClassSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);

MemberListControllerSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);

DepositSchedulerSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);
                                    
WithdrawalControllerSpec.setFixtures(deployContractNotApprovedFixture,
                                    contractApprovedFixture,
                                    contractWithAllDepositsDoneFixture,
                                    proposedWithdrawalsFixture,
                                    authorizedWithdrawalsFixture);

/* DESCRIBES TEST SCHEDULE */
describe("GraduationQuota - HandshakeSuperClass TESTS", HandshakeSuperClassSpec.tests);
describe("GraduationQuota - MemberListController TESTS", MemberListControllerSpec.tests);
describe("GraduationQuota - DepositScheduler TESTS", DepositSchedulerSpec.tests);
describe("GraduationQuota - WithdrawalController TESTS", WithdrawalControllerSpec.tests);