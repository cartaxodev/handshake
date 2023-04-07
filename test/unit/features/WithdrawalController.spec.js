const chai = require('chai');
const { expect } = require('chai');
const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');


let _deployContractNotApprovedFixture;
let _contractApprovedFixture;
let _contractWithAllDepositsDoneFixture;
let _proposedWithdrawalsFixture;
let _authorizedWithdrawalsFixture;


const setFixtures = function (deployContractNotApprovedFixture_, 
                              contractApprovedFixture_,
                              contractWithAllDepositsDoneFixture_,
                              proposedWithdrawalsFixture_,
                              authorizedWithdrawalsFixture_) {

    _deployContractNotApprovedFixture = deployContractNotApprovedFixture_;
    _contractApprovedFixture = contractApprovedFixture_;
    _contractWithAllDepositsDoneFixture = contractWithAllDepositsDoneFixture_;
    _proposedWithdrawalsFixture = proposedWithdrawalsFixture_;
    _authorizedWithdrawalsFixture = authorizedWithdrawalsFixture_;

}

const tests = async function () {

    const WithdrawalController_Logic_Factory = await ethers.getContractFactory('WithdrawalController_Logic');

    /*******************
           CONTEXT: WITHDRAWAL CONTROLLER INITIALIZATION
    *******************/
    context('CONTEXT: WITHDRAWAL CONTROLLER INITIALIZATION', function () {

        it("Should initialize OK", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                //const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                const withdrawalController = await WithdrawalController_Logic_Factory.deploy();
                await withdrawalController.initializeFeature(contract.address,
                                                            members,
                                                            [members[0]._mainAddress, members[1]._mainAddress],
                                                            2,
                                                            5);
                
                expect(withdrawalController.address).to.not.equal(0);
            }
        });

        it("Should revert because there are some unauthorized arguments configuration", async function() {
            
            const { members, notMember, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                //const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                const withdrawalController = await WithdrawalController_Logic_Factory.deploy();

                await expect (withdrawalController
                                .initializeFeature(contract.address,
                                                    members,
                                                    [members[0]._mainAddress, members[1]._mainAddress],
                                                    3,
                                                    5))
                        .to.be.revertedWith("The minimum number of members approvals necessary to withdraw cannot be greater than the total of approvers of this contract");

                await expect (withdrawalController
                                .initializeFeature(contract.address,
                                                    members,
                                                    [members[0]._mainAddress, members[1]._mainAddress],
                                                    2,
                                                    0))
                        .to.be.revertedWith( "The maximum value of a withdrawal must be greater than zero");


                await expect (withdrawalController
                    .initializeFeature(contract.address,
                                                    members,
                                                    [members[0]._mainAddress, notMember._mainAddress],
                                                    2,
                                                    5))
                        .to.be.revertedWith( "One (or more) withdrawal approver is not an active member");

            }
        });

        it("Should all approvers have the WITHDRAWAL_APPROVER_ROLE and any other address shouldn't", async function() {
            
            const { members, notMember, concreteContracts, withdrawalApprovers } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                for (approver of withdrawalApprovers) {
                    expect (await contract.hasRole(await contract.WITHDRAWAL_APPROVER_ROLE(), approver)).to.equal(true);
                }

                expect (await contract.hasRole(await contract.WITHDRAWAL_APPROVER_ROLE(), members[4]._mainAddress)).to.equal(false);
                expect (await contract.hasRole(await contract.WITHDRAWAL_APPROVER_ROLE(), notMember._mainAddress)).to.equal(false);
                
            }
        });
    });

    /*******************
        CONTEXT: WITHDRAWAL PROPOSITION
    *******************/
    context('CONTEXT: WITHDRAWAL PROPOSITION', function() {

    
        it("Should bob propose a withdrawal", async function() {

            const { members, concreteContracts, erc20Token } = await loadFixture(_contractWithAllDepositsDoneFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const bob = members[0];
                const bobId = await contract.getMemberId(bob._mainAddress);

                if (await contract.getTokenType() === 0) {
                    
                    await expect( withdrawalController
                        .connect(bob.signer)
                        .proposeWithdrawal(bobId, 5, "To spend with the music group", bob._mainAddress))
                            .to.changeEtherBalances(
                                [bob.signer, contract],
                                [0, 0]
                            );
                }
                else {

                    await expect( withdrawalController
                        .connect(bob.signer)
                        .proposeWithdrawal(bobId, 5, "To spend with the music group", bob._mainAddress))
                            .to.changeTokenBalances(
                                erc20Token,
                                [bob.signer, contract],
                                [0, 0]
                            );
                }

                const withdrawals = await withdrawalController.getProposedWithdrawals();

                expect(withdrawals.length).to.equal(1);
                expect(withdrawals[0]._id).to.equal(0);
                expect(withdrawals[0]._proposer._login).to.equal("bob");
                expect(withdrawals[0]._value).to.equal(5);
                expect(withdrawals[0]._objective).to.equal("To spend with the music group");
                expect(withdrawals[0]._to).to.equal(bob._mainAddress);
                expect(withdrawals[0]._authorized).to.equal(false);
                expect(withdrawals[0]._executionInfo._executed).to.equal(false);
                expect(withdrawals[0]._executionInfo._executionTimestamp).to.equal(0);
            }
        });

        it("Should revert because withdrawal value is out of bounds", async function() {

            const { members, concreteContracts } = await loadFixture(_contractWithAllDepositsDoneFixture);
            
            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const bob = members[0];
                const bobId = await contract.getMemberId(bob._mainAddress);
                
                await expect(withdrawalController
                    .connect(bob.signer)
                    .proposeWithdrawal(bobId, 6, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdrawal value must be equal or less than the maximum defined in this contract");
                
                await expect(withdrawalController
                    .connect(bob.signer)
                    .proposeWithdrawal(bobId, 12, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdrawal value must be equal or less than the contract balance");
            
            }
        });

        it("Should revert because the contract is not approved yet", async function() {

            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const bob = members[0];
                const bobId = await contract.getMemberId(bob._mainAddress);
                
                await expect(withdrawalController
                    .connect(bob.signer)
                    .proposeWithdrawal(bobId, 1, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("This contract is not aproved by all active members");
            }
        });
    
    
        it("Should revert because the member is not allowed", async function() {
    
            const { members, concreteContracts } = await loadFixture(_contractWithAllDepositsDoneFixture);
    
            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                const michael = members[3];
                const bob = members[0];
        
                const michaelId = await contract.getMemberId(michael._mainAddress);
                const bobId = await contract.getMemberId(bob._mainAddress);
        
                await expect(withdrawalController
                    .connect(michael.signer)
                    .proposeWithdrawal(michaelId, 1, "To spend with the music group", michael._mainAddress)).to.be.revertedWith("This address has not a needed role");
                
                await expect(withdrawalController
                    .connect(michael.signer)
                    .proposeWithdrawal(bobId, 1, "To spend with the music group", michael._mainAddress)).to.be.revertedWith("Only the main address of an active member can call this function");
            
            }
        });
    

    });
    
    
    // /*******************
    //     CONTEXT: WITHDRAWAL AUTHORIZATION
    // *******************/
    context('CONTEXT: WITHDRAWAL AUTHORIZATION', function() { 

        it("Should alice authorize the two first withdrawals", async function () {

            const { members, concreteContracts, erc20Token } = await loadFixture(_proposedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                const alice = members[1];
                const aliceId = await contract.getMemberId(alice._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
                
                for (withdraw of proposedWithdrawals) {
                    expect(withdraw._authorized).to.equal(false);
                }
    
                if (await contract.getTokenType() === 0) {
                    expect (await withdrawalController
                        .connect(alice.signer)
                        .authorizeWithdrawal(aliceId, proposedWithdrawals[0]._id)).to.changeEtherBalances(
                            [alice.signer, contract],
                            [0, 0]
                        );
                }
                else {
                    expect (await withdrawalController
                        .connect(alice.signer)
                        .authorizeWithdrawal(aliceId, proposedWithdrawals[0]._id)).to.changeTokenBalances(
                            erc20Token,
                            [alice.signer, contract],
                            [0, 0]
                        );
                }
                
                await withdrawalController.connect(alice.signer).authorizeWithdrawal(aliceId, proposedWithdrawals[2]._id);
    
                proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
    
                expect(proposedWithdrawals[0]._authorized).to.equal(true);
                expect(proposedWithdrawals[1]._authorized).to.equal(false);
                expect(proposedWithdrawals[0]._authorized).to.equal(true);
    
                expect(proposedWithdrawals[0]._authorizations[1]._login).to.equal("alice");
                expect(proposedWithdrawals[2]._authorizations[1]._login).to.equal("alice");
                expect(proposedWithdrawals[1]._authorizations.length).to.equal(1);
    
                expect(proposedWithdrawals[0]._authorized).to.equal(true);
                expect(proposedWithdrawals[1]._authorized).to.equal(false);
                expect(proposedWithdrawals[2]._authorized).to.equal(true);
            }
        });


        it("Should revert because a member cannot authorize a withdrawal twice", async function () {

            const { members, concreteContracts } = await loadFixture(_proposedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const bob = members[0];
                const bobId = await contract.getMemberId(bob._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
    
                await expect(withdrawalController
                    .connect(bob.signer)
                    .authorizeWithdrawal(bobId, proposedWithdrawals[0]._id)).to.be.revertedWith("A member cannot authorize a withdrawal twice");
                
            }           
        });
        

        it("Should revert because michael has not the approver role", async function () {

            const { members, concreteContracts } = await loadFixture(_proposedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const michael = members[3];
                const alice = members[1];
                const michaelId = await contract.getMemberId(michael._mainAddress);
                const aliceId = await contract.getMemberId(alice._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
    
                await expect(withdrawalController
                    .connect(michael.signer)
                    .authorizeWithdrawal(michaelId, proposedWithdrawals[0]._id)).to.be.revertedWith("This address has not a needed role");
                
                await expect(withdrawalController
                    .connect(michael.signer)
                    .authorizeWithdrawal(aliceId, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of an active member can call this function");
                
            }
        });


        it("Should revert because the function caller is not a member of this contract", async function () {

            const { members, notMember, concreteContracts } = await loadFixture(_proposedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const alice = members[1];
                const aliceId = await contract.getMemberId(alice._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
    
                await expect(withdrawalController
                    .connect(notMember.signer)
                    .authorizeWithdrawal(aliceId, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of an active member can call this function");
                    
            }
        });

    });
    
    
    // /*******************
    //     CONTEXT: WITHDRAWAL EXECUTION
    // *******************/
    context('CONTEXT: WITHDRAWAL EXECUTION', function() {

        it("Should bob execute an authorized withdrawal", async function () {

            const { members, concreteContracts, erc20Token } = await loadFixture(_authorizedWithdrawalsFixture);

            
            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const bob = members[0];
                const bobId = contract.getMemberId(bob._mainAddress);

                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
                let executedWithdrawals = await withdrawalController.getExecutedWithdrawals();

                expect(proposedWithdrawals.length).to.equal(3);
                expect(executedWithdrawals.length).to.equal(0);

                /* EXECUTING THE LAST WITHDRAWAL OF THE LIST */

                if (await contract.getTokenType() === 0) {

                    await expect (withdrawalController
                        .connect(bob.signer)
                        .executeWithdrawal(bobId, 2)).to.changeEtherBalances(
                            [bob.signer, contract],
                            [5, -5]
                        );
                }
                else {
                    await expect (withdrawalController
                        .connect(bob.signer)
                        .executeWithdrawal(bobId, 2)).to.changeTokenBalances(
                            erc20Token,
                            [bob.signer, contract],
                            [5, -5]
                        );
                }
            

                proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
                executedWithdrawals = await withdrawalController.getExecutedWithdrawals();

                expect(proposedWithdrawals.length).to.equal(2);
                expect(executedWithdrawals.length).to.equal(1);
                
                expect(executedWithdrawals[0]._id).to.equal(2);
                expect(executedWithdrawals[0]._executionInfo._executed).to.equal(true);
                expect(executedWithdrawals[0]._executionInfo._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                
                expect(proposedWithdrawals[0]._id).to.equal(0);
                expect(proposedWithdrawals[0]._executionInfo._executed).to.equal(false);
                expect(proposedWithdrawals[0]._executionInfo._executionTimestamp).to.equal(0);
                expect(proposedWithdrawals[1]._id).to.equal(1);
                expect(proposedWithdrawals[1]._executionInfo._executed).to.equal(false);
                expect(proposedWithdrawals[1]._executionInfo._executionTimestamp).to.equal(0);


                /* EXECUTING THE FIRST WITHDRAW OF THE LIST */
                if (await contract.getTokenType() === 0) {
                    await expect (withdrawalController
                        .connect(bob.signer)
                        .executeWithdrawal(bobId, 0)).to.changeEtherBalances(
                            [bob.signer, contract],
                            [5, -5]
                        );
                }
                else {
                    await expect (withdrawalController
                        .connect(bob.signer)
                        .executeWithdrawal(bobId, 0)).to.changeTokenBalances(
                            erc20Token,
                            [bob.signer, contract],
                            [5, -5]
                        );
                }

                proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
                executedWithdrawals = await withdrawalController.getExecutedWithdrawals();

                expect(proposedWithdrawals.length).to.equal(1);
                expect(executedWithdrawals.length).to.equal(2);
                
                expect(executedWithdrawals[0]._id).to.equal(2);
                expect(executedWithdrawals[0]._executionInfo._executed).to.equal(true);
                expect(executedWithdrawals[0]._executionInfo._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                expect(executedWithdrawals[1]._id).to.equal(0);
                expect(executedWithdrawals[1]._executionInfo._executed).to.equal(true);
                expect(executedWithdrawals[1]._executionInfo._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                
                expect(proposedWithdrawals[0]._id).to.equal(1);
                expect(proposedWithdrawals[0]._executionInfo._executed).to.equal(false);
                expect(proposedWithdrawals[0]._executionInfo._executionTimestamp).to.equal(0);
            }
        });


        it("Should revert because there is not enough balance in this contract", async function () {

            const { members, concreteContracts } = await loadFixture(_authorizedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                const bob = members[0];
                const bobId = await contract.getMemberId(bob._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
                
                await withdrawalController
                    .connect(bob.signer)
                    .executeWithdrawal(bobId, proposedWithdrawals[0]._id);
                
                await withdrawalController
                    .connect(bob.signer)
                    .executeWithdrawal(bobId, proposedWithdrawals[1]._id)

                await expect(withdrawalController
                    .connect(bob.signer)
                    .executeWithdrawal(bobId, proposedWithdrawals[2]._id))
                        .to.be.revertedWith("There is not enough balance in this contract to execute this transaction");
            }
        });


        it("Should revert because the proposed withdrawal is not pending anymore", async function () {

            const { members, concreteContracts } = await loadFixture(_authorizedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());
                
                const bob = members[0];
                const bobId = await contract.getMemberId(bob._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
                
                await withdrawalController
                    .connect(bob.signer)
                    .executeWithdrawal(bobId, proposedWithdrawals[0]._id);

                await expect(withdrawalController
                    .connect(bob.signer)
                    .executeWithdrawal(bobId, proposedWithdrawals[0]._id))
                        .to.be.revertedWith("Proposed withdrawal not found");
            }
        });
        

        it("Should revert because michael has not the approval role", async function () {

            const { members, concreteContracts } = await loadFixture(_authorizedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const michael = members[3];
                const alice = members[1];
                const michaelId = await contract.getMemberId(michael._mainAddress);
                const aliceId = await contract.getMemberId(alice._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
    
                await expect(withdrawalController
                    .connect(michael.signer)
                    .executeWithdrawal(michaelId, proposedWithdrawals[0]._id)).to.be.revertedWith("This address has not a needed role");
                
                await expect(withdrawalController
                    .connect(michael.signer)
                    .executeWithdrawal(aliceId, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of an active member can call this function");
                
            }
        });


        it("Should revert because the function caller is not a member of this contract", async function () {

            const { members, notMember, concreteContracts } = await loadFixture(_authorizedWithdrawalsFixture);

            for (contract of concreteContracts) {

                const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                const alice = members[1];
                const aliceId = await contract.getMemberId(alice._mainAddress);
    
                let proposedWithdrawals = await withdrawalController.getProposedWithdrawals();
    
                await expect(withdrawalController
                    .connect(notMember.signer)
                    .executeWithdrawal(aliceId, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of an active member can call this function");
            }
        });

    });
}

module.exports = {setFixtures, tests};