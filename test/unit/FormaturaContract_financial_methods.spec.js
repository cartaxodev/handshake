const chai = require('chai');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('./mocks/MembersMock.js');


describe("FormaturaContract's financial methods Unit Test", function () {

    async function deployContractNotApprovedFixture () {

        const minCommiteMembersToWithdraw = 2;
        const maxWithdrawValue = 5;

        const [members, notMember] = await membersMock.getMembers();
    
        const FormaturaContract = await ethers.getContractFactory('FormaturaContract');
        const formaturaContract = await FormaturaContract.deploy(members, minCommiteMembersToWithdraw, maxWithdrawValue);
        await formaturaContract.deployed();

        return { formaturaContract, members, notMember };
    }

    async function contractApprovedFixture () {
        const { formaturaContract, members, notMember } = await deployContractNotApprovedFixture();

        for (member of members) {
            const memberIndex = formaturaContract.getMemberIndex(member._mainAddress);
            await formaturaContract.connect(member.signer).approveTheContract(memberIndex);
        }

        return { formaturaContract, members, notMember };
    }

    async function contractWithAllPaymentsDoneFixture () {
        const { formaturaContract, members, notMember } = await contractApprovedFixture();
        let cont = 0;

        for (member of members) {
            const memberIndex = formaturaContract.getMemberIndex(member._mainAddress);

            for (payment of member._payments) {

                await formaturaContract
                    .connect(member.signer)
                    .payNextPayment_ETH(memberIndex, {value: 1});
                cont++;
            }
        }

        console.log(`Executed ${cont} payments in this fixture`);
        
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
    

        it("Should bob pay his first payment with main address", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
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


        it("Should bob pay his first payment with secondary address", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await formaturaContract
                    .connect(bob.secondarySigners[0])
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


        it("Should revert because alice (main and secondary addresses) cannot pay bob's payments. Only bob can do it", async function() {
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
            const bob = members[0];
            const alice = members[1];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
            const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
    
            await expect (formaturaContract
                .connect(alice.signer)
                .payNextPayment_ETH(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
            
            await expect (formaturaContract
                .connect(alice.secondarySigners)
                .payNextPayment_ETH(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
                    

        });


        it("Should revert because the transaction value is not equal to the payment value", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment_ETH(bobIndex, {value: 999})).to.be.revertedWith('The transaction value must be equal to the payment value');
            
        });


        it("Should revert because there is no pending payments anymore", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
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


    context('METHOD: ProposeWithdraw()', function() {

        
        it("Should bob propose a withdraw", async function() {

            const { members, formaturaContract } = await loadFixture(contractWithAllPaymentsDoneFixture);

            const bob = members[0];

            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

            await formaturaContract
                .connect(bob.signer)
                .proposeWithdraw_ETH(bobIndex, 5, "To spend with the music group", bob._mainAddress);

            const withdrawals = await formaturaContract.getProposedWithdrawals();

            expect(withdrawals.length).to.equal(1);
            expect(withdrawals[0]._id).to.equal(0);
            expect(withdrawals[0]._proposer._login).to.equal("bob");
            expect(withdrawals[0]._value).to.equal(5);
            expect(withdrawals[0]._objective).to.equal("To spend with the music group");
            expect(withdrawals[0]._destination).to.equal(bob._mainAddress);
        });

    });


    it("Should revert because withdraw value is out of bounds", async function() {

        const { members, formaturaContract } = await loadFixture(contractWithAllPaymentsDoneFixture);

        const bob = members[0];

        const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

        await expect(formaturaContract
            .connect(bob.signer)
            .proposeWithdraw_ETH(bobIndex, 6, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdraw value must be equal or less than the maximum defined in this contract");
        
        await expect(formaturaContract
            .connect(bob.signer)
            .proposeWithdraw_ETH(bobIndex, 12, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdraw value must be equal or less than the contract balance");
    
    });


    it("Should revert because withdraw value is out of bounds", async function() {

        const { members, formaturaContract } = await loadFixture(contractWithAllPaymentsDoneFixture);

        const michael = members[3];
        const bob = members[0];

        const michaelIndex = await formaturaContract.getMemberIndex(michael._mainAddress);
        const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

        await expect(formaturaContract
            .connect(michael.signer)
            .proposeWithdraw_ETH(michaelIndex, 1, "To spend with the music group", michael._mainAddress)).to.be.revertedWith("Only committe members can call this function");
        
        await expect(formaturaContract
            .connect(michael.signer)
            .proposeWithdraw_ETH(bobIndex, 1, "To spend with the music group", michael._mainAddress)).to.be.revertedWith("Only the main address of a member can call this function");
    
    });

});