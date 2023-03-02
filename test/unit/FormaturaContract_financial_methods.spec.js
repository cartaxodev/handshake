const chai = require('chai');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('./mocks/MembersMock.js');


describe("FormaturaContract's financial methods Unit Test", function () {

    async function deployContractNotApprovedFixture () {
        const [members, notMember] = await membersMock.getMembers();
    
        const FormaturaContract = await ethers.getContractFactory('FormaturaContract');
        const formaturaContract = await FormaturaContract.deploy(members, 2, 1);
        await formaturaContract.deployed();

        return { formaturaContract, members, notMember };
    }

    async function deployContractAndAllMembersApproveFixture () {
        const { formaturaContract, members, notMember } = await deployContractNotApprovedFixture();

        for (member of members) {
            const memberIndex = formaturaContract.getMemberIndex(member._mainAddress);
            await formaturaContract.connect(member.signer).approveTheContract(memberIndex);
        }

        return { formaturaContract, members, notMember };
    }


    context('METHOD: payNextPayment()', function () {


        it("Should revert because the contract is not aproved for all members yet", async function() {
            
            const { members, formaturaContract } = await loadFixture(deployContractNotApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 1})).to.be.revertedWith('This contract is not aproved by all members');
            
        });
    

        it("Should bob pay his first payment", async function() {
            
            const { members, formaturaContract } = await loadFixture(deployContractAndAllMembersApproveFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 1});
            
            // console.log(result);
    
            const contractMembers = await formaturaContract.getMembers();
            const contractBob = contractMembers[bobIndex];
    
            expect(contractBob._payments[0]._paid).to.equal(true);
            expect(contractBob._payments[0]._paymentDate).to.not.equal(0);
            expect(contractBob._payments[1]._paid).to.equal(false);
    
            /* All the other members must to have all their payments still pending */
            for (let i = 0; i < contractMembers.length; i++) {
                if (i !== bobIndex) {
                    contractMember = contractMembers[i];
                    
                    for (payment of contractMember._payments) {
                        expect(payment._paid).to.equal(false);
                    }
                }
            }

        });


        it("Should revert because alice cannot pay bob's payments. Only bob can do it", async function() {
            const { members, formaturaContract } = await loadFixture(deployContractAndAllMembersApproveFixture);
            
            const bob = members[0];
            const alice = members[1];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
            const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
    
            await expect (formaturaContract
                .connect(alice.signer)
                .payNextPayment_ETH(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
            
        });


        it("Should revert because the transaction value is not equal to the payment value", async function() {
            
            const { members, formaturaContract } = await loadFixture(deployContractAndAllMembersApproveFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 999})).to.be.revertedWith('The transaction value must be equal to the payment value');
            
        });


        it("Should revert because there is no pending payments anymore", async function() {
            
            const { members, formaturaContract } = await loadFixture(deployContractAndAllMembersApproveFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 1});

            await formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 1});

            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 1})).to.be.revertedWith('This member has not pending payments anymore');
            
        });

    });

});