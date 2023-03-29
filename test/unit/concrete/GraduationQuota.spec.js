const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('../mocks/general/MembersMock.js');
const MultimemberContractSpec = require("../features/MultimemberContract.spec.js");


/* FIXTURES DEFINITION */

const deployContractNotApprovedFixture = async function () {

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
    const withdrawalApprovers = memberManagers;

    const ERC20Contract = await ethers.getContractFactory('ERC20PresetMinterPauser');
    const [erc20TokenOwner] = await ethers.getSigners();
    const erc20Token = await ERC20Contract.connect(erc20TokenOwner).deploy("Rodrigo_Token", "RCMD");
    await erc20Token.deployed();

    // await erc20Token.connect(erc20TokenOwner).mint(members[0]._mainAddress, 100);
    // await erc20Token.connect(erc20TokenOwner).mint(members[0]._secondaryAddresses[0], 100);
    // await erc20Token.connect(erc20TokenOwner).mint(members[1]._mainAddress, 100);
    // await erc20Token.connect(erc20TokenOwner).mint(members[2]._mainAddress, 100);
    // await erc20Token.connect(erc20TokenOwner).mint(members[3]._mainAddress, 100);
    // await erc20Token.connect(erc20TokenOwner).mint(members[4]._mainAddress, 100);

    const GraduationQuotaETH = await ethers.getContractFactory('GraduationQuota_ETH');
    const graduationQuotaETH = await GraduationQuotaETH.deploy("To get funds to graduation party",
                                                               members,
                                                               memberManagers/*,
                                                            deadlineControlConfig,
                                                               withdrawalApprovers,
                                                               minApprovalsToWithdraw, 
                                                               maxWithdrawValue*/
                                                               );
    await graduationQuotaETH.deployed();

    // const FormaturaContractERC20 = await ethers.getContractFactory('FormaturaContractERC20');
    // const formaturaContractERC20 = await FormaturaContractERC20.deploy(members, minCommiteMembersToWithdraw, maxWithdrawValue, erc20Token.address);
    // await formaturaContractERC20.deployed();

    const graduationQuotas = [graduationQuotaETH];
        //, formaturaContractERC20];

    return { graduationQuotas, erc20Token, members, notMember };
}

const contractApprovedFixture = async function () {
    const { graduationQuotas, erc20Token, members, notMember } = await loadFixture(deployContractNotApprovedFixture);

    for (contract of graduationQuotas) {
        for (member of members) {
            const memberIndex = await contract.getMemberIndex(member._mainAddress);
            await contract.connect(member.signer).approveTheContract(memberIndex);
        }
    }

    return { graduationQuotas, erc20Token, members, notMember };
}

/* SET THE FIXTURES FOR THIS TEST SCHEDULE */
MultimemberContractSpec.setFixtures(deployContractNotApprovedFixture, 
                                    contractApprovedFixture);

/* DESCRIBES TEST SCHEDULE */
describe("GraduationQuota_ETH - isMultimemberContract TESTS", MultimemberContractSpec.tests);