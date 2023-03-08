const chai = require('chai');
const { expect } = require('chai');
const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const membersMock = require('./mocks/MembersMock.js');


describe("FormaturaContract's financial methods Unit Test", function () {

    /*******************
        FIXTURES FUNCTIONS:
    *******************/

    async function deployContractNotApprovedFixture () {

        const minCommiteMembersToWithdraw = 2;
        const maxWithdrawValue = 5;

        const [members, notMember] = await membersMock.getMembers();
    
        const FormaturaContract = await ethers.getContractFactory('FormaturaContractETH');
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
                    .payNextPayment(memberIndex, {value: 1});
                cont++;
            }
        }
        
        return { formaturaContract, members, notMember };
    }

    async function proposedWithdrawalsFixture () {
        const { formaturaContract, members, notMember } = await contractWithAllPaymentsDoneFixture();

        const bob = members[0];
        const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

        await formaturaContract
            .connect(bob.signer)
            .proposeWithdraw(bobIndex, 5, "fixture withdraw 1", bob._mainAddress);

        await formaturaContract
            .connect(bob.signer)
            .proposeWithdraw(bobIndex, 5, "fixture withdraw 2", bob._mainAddress);

        await formaturaContract
            .connect(bob.signer)
            .proposeWithdraw(bobIndex, 5, "fixture withdraw 3", bob._mainAddress);

        return { formaturaContract, members, notMember };
    }

    async function authorizedWithdrawalsFixture () {
        const { formaturaContract, members, notMember } = await proposedWithdrawalsFixture();

        const alice = members[1];
        const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);

        await formaturaContract
            .connect(alice.signer)
            .authorizeWithdraw(aliceIndex, 0);

        await formaturaContract
            .connect(alice.signer)
            .authorizeWithdraw(aliceIndex, 1);
        
        await formaturaContract
            .connect(alice.signer)
            .authorizeWithdraw(aliceIndex, 2);

        return { formaturaContract, members, notMember };
    }


    /*******************
        CONTEXT: Unit tests for FormaturaContract.payNextPayent( ... )
    *******************/
    context('METHOD: payNextPayment( ... )', function () {


        it("Should revert because the contract is not aproved for all members yet", async function() {
            
            const { members, formaturaContract } = await loadFixture(deployContractNotApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('This contract is not aproved by all members');
            
        });
    

        it("Should bob pay his first payment with main address", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect( formaturaContract
                .connect(bob.signer)
                .payNextPayment(bobIndex, {value: 1})).to.changeEtherBalances(
                    [bob.signer, formaturaContract],
                    [-1, 1]
                );
    
            const contractMembers = await formaturaContract.getMembers();
            const contractBob = contractMembers[bobIndex];
    
            expect(contractBob._payments[0]._paid).to.equal(true);
            expect(contractBob._payments[0]._paymentDate).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
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
    
            await expect( formaturaContract
                    .connect(bob.secondarySigners[0])
                    .payNextPayment(bobIndex, {value: 1})).to.changeEtherBalances(
                        [bob.secondarySigners[0], formaturaContract],
                        [-1, 1]
                    );
    
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
                .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
            
            await expect (formaturaContract
                .connect(alice.secondarySigners)
                .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
                    

        });


        it("Should revert because the transaction value is not equal to the payment value", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment(bobIndex, {value: 999})).to.be.revertedWith('The transaction value must be equal to the payment value');
            
        });


        it("Should revert because there is no pending payments anymore", async function() {
            
            const { members, formaturaContract } = await loadFixture(contractApprovedFixture);
            
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await formaturaContract
                    .connect(bob.signer)
                    .payNextPayment(bobIndex, {value: 1});

            await formaturaContract
                    .connect(bob.signer)
                    .payNextPayment(bobIndex, {value: 1});

            await expect (formaturaContract
                    .connect(bob.signer)
                    .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('This member has not pending payments anymore');
            
        });

    });


    /*******************
        CONTEXT: Unit tests for FormaturaContract.proposeWithdraw( ... )
    *******************/
    context('METHOD: proposeWithdraw( ... )', function() {

        
        it("Should bob propose a withdraw", async function() {

            const { members, formaturaContract } = await loadFixture(contractWithAllPaymentsDoneFixture);

            const bob = members[0];

            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

            await expect( formaturaContract
                .connect(bob.signer)
                .proposeWithdraw(bobIndex, 5, "To spend with the music group", bob._mainAddress))
                    .to.changeEtherBalances(
                        [bob.signer, formaturaContract],
                        [0, 0]
                    );

            const withdrawals = await formaturaContract.getProposedWithdrawals();

            expect(withdrawals.length).to.equal(1);
            expect(withdrawals[0]._id).to.equal(0);
            expect(withdrawals[0]._proposer._login).to.equal("bob");
            expect(withdrawals[0]._value).to.equal(5);
            expect(withdrawals[0]._objective).to.equal("To spend with the music group");
            expect(withdrawals[0]._destination).to.equal(bob._mainAddress);
            expect(withdrawals[0]._authorized).to.equal(false);
            expect(withdrawals[0]._executed).to.equal(false);
            expect(withdrawals[0]._executionTimestamp).to.equal(0);
        });

        it("Should revert because withdraw value is out of bounds", async function() {

            const { members, formaturaContract } = await loadFixture(contractWithAllPaymentsDoneFixture);
    
            const bob = members[0];
    
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect(formaturaContract
                .connect(bob.signer)
                .proposeWithdraw(bobIndex, 6, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdraw value must be equal or less than the maximum defined in this contract");
            
            await expect(formaturaContract
                .connect(bob.signer)
                .proposeWithdraw(bobIndex, 12, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdraw value must be equal or less than the contract balance");
        
        });
    
    
        it("Should revert because withdraw value is out of bounds", async function() {
    
            const { members, formaturaContract } = await loadFixture(contractWithAllPaymentsDoneFixture);
    
            const michael = members[3];
            const bob = members[0];
    
            const michaelIndex = await formaturaContract.getMemberIndex(michael._mainAddress);
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
            await expect(formaturaContract
                .connect(michael.signer)
                .proposeWithdraw(michaelIndex, 1, "To spend with the music group", michael._mainAddress)).to.be.revertedWith("Only committe members can call this function");
            
            await expect(formaturaContract
                .connect(michael.signer)
                .proposeWithdraw(bobIndex, 1, "To spend with the music group", michael._mainAddress)).to.be.revertedWith("Only the main address of a member can call this function");
        
        });
    

    });
    

    /*******************
        CONTEXT: Unit tests for FormaturaContract.authorizeWithdraw( ... )
    *******************/
    context('METHOD: authorizeWithdraw( ... )', function() { 

        it("Should alice authorize the two first withdrawals", async function () {

            const { members, formaturaContract } = await loadFixture(proposedWithdrawalsFixture);

            const alice = members[1];
            const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);

            let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
            
            for (withdraw of proposedWithdrawals) {
                expect(withdraw._authorized).to.equal(false);
            }

            expect (await formaturaContract
                .connect(alice.signer)
                .authorizeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.changeEtherBalances(
                    [alice.signer, formaturaContract],
                    [0, 0]
                );
            
            await formaturaContract.connect(alice.signer).authorizeWithdraw(aliceIndex, proposedWithdrawals[2]._id);

            proposedWithdrawals = await formaturaContract.getProposedWithdrawals();

            expect(proposedWithdrawals[0]._authorized).to.equal(true);
            expect(proposedWithdrawals[1]._authorized).to.equal(false);
            expect(proposedWithdrawals[0]._authorized).to.equal(true);

            expect(proposedWithdrawals[0]._authorizations[1]._login).to.equal("alice");
            expect(proposedWithdrawals[2]._authorizations[1]._login).to.equal("alice");
            expect(proposedWithdrawals[1]._authorizations.length).to.equal(1);

            expect(proposedWithdrawals[0]._authorized).to.equal(true);
            expect(proposedWithdrawals[1]._authorized).to.equal(false);
            expect(proposedWithdrawals[2]._authorized).to.equal(true);

        });


        it("Should revert because a member cannot authorize a withdraw twice", async function () {

            const { members, formaturaContract } = await loadFixture(proposedWithdrawalsFixture);

            const bob = members[0];
            const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

            let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();

            await expect(formaturaContract
                .connect(bob.signer)
                .authorizeWithdraw(bobIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("A member cannot authorize a withdraw twice");
            
        });
        

        it("Should revert because michael is not a committe member", async function () {

            const { members, formaturaContract } = await loadFixture(proposedWithdrawalsFixture);

            const michael = members[3];
            const alice = members[1];
            const michaelIndex = await formaturaContract.getMemberIndex(michael._mainAddress);
            const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);

            let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();

            await expect(formaturaContract
                .connect(michael.signer)
                .authorizeWithdraw(michaelIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only committe members can call this function");
            
            await expect(formaturaContract
                .connect(michael.signer)
                .authorizeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of a member can call this function");
            
        });


        it("Should revert because the function caller is not a member of this contract", async function () {

            const { members, notMember, formaturaContract } = await loadFixture(proposedWithdrawalsFixture);

            const alice = members[1];
            const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);

            let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();

            await expect(formaturaContract
                .connect(notMember.signer)
                .authorizeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of a member can call this function");
              
        });

    });


    /*******************
        CONTEXT: Unit tests for FormaturaContract.executeWithdraw( ... )
    *******************/
        context('METHOD: executeWithdraw( ... )', function() {

            it("Should bob execute an authorized withdraw", async function () {

                const { members, formaturaContract } = await loadFixture(authorizedWithdrawalsFixture);

                const bob = members[0];
                const bobIndex = formaturaContract.getMemberIndex(bob._mainAddress);

                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                let executedWithdrawals = await formaturaContract.getExecutedWithdrawals();

                expect(proposedWithdrawals.length).to.equal(3);
                expect(executedWithdrawals.length).to.equal(0);

                /* EXECUTING THE LAST WITHDRAW OF THE LIST */
                await expect (formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, 2)).to.changeEtherBalances(
                        [bob.signer, formaturaContract],
                        [5, -5]
                    );

                proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                executedWithdrawals = await formaturaContract.getExecutedWithdrawals();

                expect(proposedWithdrawals.length).to.equal(2);
                expect(executedWithdrawals.length).to.equal(1);
                
                expect(executedWithdrawals[0]._id).to.equal(2);
                expect(executedWithdrawals[0]._executed).to.equal(true);
                expect(executedWithdrawals[0]._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                
                expect(proposedWithdrawals[0]._id).to.equal(0);
                expect(proposedWithdrawals[0]._executed).to.equal(false);
                expect(proposedWithdrawals[0]._executionTimestamp).to.equal(0);
                expect(proposedWithdrawals[1]._id).to.equal(1);
                expect(proposedWithdrawals[1]._executed).to.equal(false);
                expect(proposedWithdrawals[1]._executionTimestamp).to.equal(0);


                /* EXECUTING THE FIRST WITHDRAW OF THE LIST */
                await expect (formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, 0)).to.changeEtherBalances(
                        [bob.signer, formaturaContract],
                        [5, -5]
                    );

                proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                executedWithdrawals = await formaturaContract.getExecutedWithdrawals();

                expect(proposedWithdrawals.length).to.equal(1);
                expect(executedWithdrawals.length).to.equal(2);
                
                expect(executedWithdrawals[0]._id).to.equal(2);
                expect(executedWithdrawals[0]._executed).to.equal(true);
                expect(executedWithdrawals[0]._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                expect(executedWithdrawals[1]._id).to.equal(0);
                expect(executedWithdrawals[1]._executed).to.equal(true);
                expect(executedWithdrawals[1]._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                
                expect(proposedWithdrawals[0]._id).to.equal(1);
                expect(proposedWithdrawals[0]._executed).to.equal(false);
                expect(proposedWithdrawals[0]._executionTimestamp).to.equal(0);

            });


            it("Should revert because there is not enough balance in this contract", async function () {

                const { members, formaturaContract } = await loadFixture(authorizedWithdrawalsFixture);
    
                const bob = members[0];
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                
                await formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, proposedWithdrawals[0]._id);
                
                await formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, proposedWithdrawals[1]._id)

                await expect(formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, proposedWithdrawals[2]._id))
                        .to.be.revertedWith("There is not enough balance in this contract to execute this transaction");
                
            });


            it("Should revert because there is not enough balance in this contract", async function () {

                const { members, formaturaContract } = await loadFixture(authorizedWithdrawalsFixture);
    
                const bob = members[0];
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                
                await formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, proposedWithdrawals[0]._id);

                await expect(formaturaContract
                    .connect(bob.signer)
                    .executeWithdraw(bobIndex, proposedWithdrawals[0]._id))
                        .to.be.revertedWith("Proposed withdraw not found");
                
            });
            
    
            it("Should revert because michael is not a committe member", async function () {
    
                const { members, formaturaContract } = await loadFixture(authorizedWithdrawalsFixture);
    
                const michael = members[3];
                const alice = members[1];
                const michaelIndex = await formaturaContract.getMemberIndex(michael._mainAddress);
                const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
    
                await expect(formaturaContract
                    .connect(michael.signer)
                    .executeWithdraw(michaelIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only committe members can call this function");
                
                await expect(formaturaContract
                    .connect(michael.signer)
                    .executeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of a member can call this function");
                
            });
    
    
            it("Should revert because the function caller is not a member of this contract", async function () {
    
                const { members, notMember, formaturaContract } = await loadFixture(authorizedWithdrawalsFixture);
    
                const alice = members[1];
                const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
    
                await expect(formaturaContract
                    .connect(notMember.signer)
                    .executeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of a member can call this function");
                  
            });

        });

});