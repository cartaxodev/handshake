const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('../mocks/general/MembersMock.js');
const depositScheduleMock = require('../mocks/general/DepositScheduleMock.js');
const HandshakeSuperClassSpec = require("../templates/HandshakeSuperClass/HandshakeSuperClass.spec.js");
const DepositSchedulerSpec = require("./../features/DepositScheduler.spec.js");
const WithdrawalControllerSpec = require("./../features/WithdrawalController.spec.js");


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

    return { concreteContracts, erc20Token, members, notMember, memberManagers };
}

const contractApprovedFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers } = await loadFixture(deployContractNotApprovedFixture);

    for (contract of concreteContracts) {
        for (member of members) {
            const memberId = await contract.getMemberId(member._mainAddress);
            await contract.connect(member.signer).approveTheContract(memberId);
        }
    }

    return { concreteContracts, erc20Token, members, notMember, memberManagers };
}

const contractWithAllDepositsDoneFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers } = await loadFixture(contractApprovedFixture);
    
    const DepositScheduler_Logic_Factory = await ethers.getContractFactory('DepositScheduler_Logic');

    for (contract of concreteContracts) {

        const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());

        if (await contract.getTokenType() === 0) {
            
            for (member of members) {
                const memberId = await contract.getMemberId(member._mainAddress);

                for (deposit of member._deposits) {

                    await depositScheduler
                        .connect(member.signer)
                        .payNextDeposit(memberId, {value: 1});
                }
            }
        }
        else {
            for (member of members) {
                const memberId = await contract.getMemberId(member._mainAddress);

                for (deposit of member._deposits) {

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
    
    return { concreteContracts, erc20Token, members, notMember, memberManagers };
}

const proposedWithdrawalsFixture = async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers }= await loadFixture(contractWithAllDepositsDoneFixture);

    const WithdrawalController_Logic_Factory = await ethers.getContractFactory('WithdrawalController_Logic');

    for (contract of concreteContracts) {

        const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

        const bob = members[0];
        const bobId = await contract.getMemberId(bob._mainAddress);

        await withdrawalController
            .connect(bob.signer)
            .proposeWithdrawal(bobId, 5, "fixture withdraw 1", bob._mainAddress);

        await withdrawalController
            .connect(bob.signer)
            .proposeWithdrawal(bobId, 5, "fixture withdraw 2", bob._mainAddress);

        await withdrawalController
            .connect(bob.signer)
            .proposeWithdrawal(bobId, 5, "fixture withdraw 3", bob._mainAddress);
    }

    return { concreteContracts, erc20Token, members, notMember, memberManagers };
}

const authorizedWithdrawalsFixture =  async function () {
    const { concreteContracts, erc20Token, members, notMember, memberManagers } = await loadFixture(proposedWithdrawalsFixture);

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

    return { concreteContracts, erc20Token, members, notMember, memberManagers };
}


/* SET THE FIXTURES FOR THIS TEST SCHEDULE */
HandshakeSuperClassSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);

DepositSchedulerSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);
                                    
WithdrawalControllerSpec.setFixtures(deployContractNotApprovedFixture,
                                    contractApprovedFixture);

/* DESCRIBES TEST SCHEDULE */
describe("GraduationQuota_ETH - HandshakeSuperClass TESTS", HandshakeSuperClassSpec.tests);
describe("GraduationQuota_ETH - DepositScheduler TESTS", DepositSchedulerSpec.tests);
describe("GraduationQuota_ETH - WithdrawalController TESTS", WithdrawalControllerSpec.tests);