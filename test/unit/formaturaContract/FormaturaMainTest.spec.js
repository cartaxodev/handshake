const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('../mocks/formatura/FormaturaMembersMock.js');
const {setFixtures, financialTests} = require("./FormaturaContract_financial_methods.spec.js");


/* FIXTURES DEFINITION */

const deployContractNotApprovedFixture = async function () {

    const minCommiteMembersToWithdraw = 2;
    const maxWithdrawValue = 5;

    const [members, notMember] = await membersMock.getMembers();

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

    const FormaturaContractETH = await ethers.getContractFactory('FormaturaContractETH');
    const formaturaContractETH = await FormaturaContractETH.deploy(members, minCommiteMembersToWithdraw, maxWithdrawValue);
    await formaturaContractETH.deployed();

    const FormaturaContractERC20 = await ethers.getContractFactory('FormaturaContractERC20');
    const formaturaContractERC20 = await FormaturaContractERC20.deploy(members, minCommiteMembersToWithdraw, maxWithdrawValue, erc20Token.address);
    await formaturaContractERC20.deployed();

    const formaturaContracts = [formaturaContractETH, formaturaContractERC20];

    return { formaturaContracts, erc20Token, members, notMember };
}

const contractApprovedFixture = async function () {
    const { formaturaContracts, erc20Token, members, notMember } = await deployContractNotApprovedFixture();

    for (formaturaContract of formaturaContracts) {
        for (member of members) {
            const memberIndex = await formaturaContract.getMemberIndex(member._mainAddress);
            await formaturaContract.connect(member.signer).approveTheContract(memberIndex);
        }
    }

    return { formaturaContracts, erc20Token, members, notMember };
}

const contractWithAllPaymentsDoneFixture = async function () {
    const { formaturaContracts, erc20Token, members, notMember } = await loadFixture(contractApprovedFixture);
    
    for (formaturaContract of formaturaContracts) {

        if (await formaturaContract.getTokenType() === 0) {
            for (member of members) {
                const memberIndex = await formaturaContract.getMemberIndex(member._mainAddress);

                for (deposit of member._deposits) {

                    await formaturaContract
                        .connect(member.signer)
                        .payNextDeposit(memberIndex, {value: 1});
                }
            }
        }
        else {
            for (member of members) {
                const memberIndex = await formaturaContract.getMemberIndex(member._mainAddress);

                for (deposit of member._deposits) {

                    await erc20Token
                        .connect(member.signer)
                        .approve(formaturaContract.address, 1);

                    await formaturaContract
                        .connect(member.signer)
                        .payNextDeposit(memberIndex);
                }
            }
        }
    }
    
    return { formaturaContracts, erc20Token, members, notMember };
}

const proposedWithdrawalsFixture = async function () {
    const { formaturaContracts, erc20Token, members, notMember } = await loadFixture(contractWithAllPaymentsDoneFixture);

    for (formaturaContract of formaturaContracts) {
        const bob = members[0];
        const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

        await formaturaContract
            .connect(bob.signer)
            .proposeWithdrawal(bobIndex, 5, "fixture withdraw 1", bob._mainAddress);

        await formaturaContract
            .connect(bob.signer)
            .proposeWithdrawal(bobIndex, 5, "fixture withdraw 2", bob._mainAddress);

        await formaturaContract
            .connect(bob.signer)
            .proposeWithdrawal(bobIndex, 5, "fixture withdraw 3", bob._mainAddress);
    }

    return { formaturaContracts, erc20Token, members, notMember };
}

const authorizedWithdrawalsFixture =  async function () {
    const { formaturaContracts, erc20Token, members, notMember } = await loadFixture(proposedWithdrawalsFixture);

    for (formaturaContract of formaturaContracts) {
        const alice = members[1];
        const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);

        await formaturaContract
            .connect(alice.signer)
            .authorizeWithdrawal(aliceIndex, 0);

        await formaturaContract
            .connect(alice.signer)
            .authorizeWithdrawal(aliceIndex, 1);
        
        await formaturaContract
            .connect(alice.signer)
            .authorizeWithdrawal(aliceIndex, 2);
    }

    return { formaturaContracts, erc20Token, members, notMember };
}


/* SET THE FIXTURES FOR THIS TEST SCHEDULE */
setFixtures(deployContractNotApprovedFixture, 
            contractApprovedFixture, 
            contractWithAllPaymentsDoneFixture, 
            proposedWithdrawalsFixture, 
            authorizedWithdrawalsFixture);

/* DESCRIBES TEST SCHEDULE */
//describe("FormaturaContract's financial methods Unit Test", financialTests);