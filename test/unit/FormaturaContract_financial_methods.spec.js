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

    async function contractApprovedFixture () {
        const { formaturaContracts, erc20Token, members, notMember } = await deployContractNotApprovedFixture();

        for (formaturaContract of formaturaContracts) {
            for (member of members) {
                const memberIndex = await formaturaContract.getMemberIndex(member._mainAddress);
                await formaturaContract.connect(member.signer).approveTheContract(memberIndex);
            }
        }

        return { formaturaContracts, erc20Token, members, notMember };
    }

    async function contractWithAllPaymentsDoneFixture () {
        const { formaturaContracts, erc20Token, members, notMember } = await loadFixture(contractApprovedFixture);
        
        for (formaturaContract of formaturaContracts) {

            if (await formaturaContract.getTokenType() === 0) {
                for (member of members) {
                    const memberIndex = await formaturaContract.getMemberIndex(member._mainAddress);

                    for (payment of member._payments) {

                        await formaturaContract
                            .connect(member.signer)
                            .payNextPayment(memberIndex, {value: 1});
                    }
                }
            }
            else {
                for (member of members) {
                    const memberIndex = await formaturaContract.getMemberIndex(member._mainAddress);

                    for (payment of member._payments) {

                        await erc20Token
                            .connect(member.signer)
                            .approve(formaturaContract.address, 1);

                        await formaturaContract
                            .connect(member.signer)
                            .payNextPayment(memberIndex);
                    }
                }
            }
        }
        
        return { formaturaContracts, erc20Token, members, notMember };
    }

    async function proposedWithdrawalsFixture () {
        const { formaturaContracts, erc20Token, members, notMember } = await loadFixture(contractWithAllPaymentsDoneFixture);

        for (formaturaContract of formaturaContracts) {
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
        }

        return { formaturaContracts, erc20Token, members, notMember };
    }

    async function authorizedWithdrawalsFixture () {
        const { formaturaContracts, erc20Token, members, notMember } = await loadFixture(proposedWithdrawalsFixture);

        for (formaturaContract of formaturaContracts) {
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
        }

        return { formaturaContracts, erc20Token, members, notMember };
    }


    /*******************
        CONTEXT: Unit tests for FormaturaContract.payNextPayent( ... )
    *******************/
    context('METHOD: payNextPayment( ... )', function () {


        it("Should revert because the contract is not aproved for all members yet", async function() {
            
            const { members, formaturaContracts } = await loadFixture(deployContractNotApprovedFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
        
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
                
                if (await formaturaContract.getTokenType() === 0) {
                    
                    await expect (formaturaContract
                        .connect(bob.signer)
                        .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('This contract is not aproved by all members');

                } else {

                    await expect (formaturaContract
                        .connect(bob.signer)
                        .payNextPayment(bobIndex)).to.be.revertedWith('This contract is not aproved by all members');

                }
                
            }
        });
    

        it("Should bob pay his first payment with main address", async function() {
            
            const { members, formaturaContracts, erc20Token } = await loadFixture(contractApprovedFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
    
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
        
                if (await formaturaContract.getTokenType() === 0) {
                    
                    await expect( formaturaContract
                        .connect(bob.signer)
                        .payNextPayment(bobIndex, {value: 1})).to.changeEtherBalances(
                            [bob.signer, formaturaContract],
                            [-1, 1]
                        );
                }
                else {

                    await erc20Token
                            .connect(bob.signer)
                            .approve(formaturaContract.address, 1);
                    
                    await expect( formaturaContract
                        .connect(bob.signer)
                        .payNextPayment(bobIndex)).to.changeTokenBalances(
                            erc20Token,
                            [bob.signer, formaturaContract],
                            [-1, 1]
                        );

                }
        
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

            }
            
        });


        it("Should bob pay his first payment with secondary address", async function() {
            
            const { members, formaturaContracts, erc20Token } = await loadFixture(contractApprovedFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
    
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
        
                if (await formaturaContract.getTokenType() === 0) {

                    await expect( formaturaContract
                        .connect(bob.secondarySigners[0])
                        .payNextPayment(bobIndex, {value: 1})).to.changeEtherBalances(
                            [bob.secondarySigners[0], formaturaContract],
                            [-1, 1]
                        );
                }
                else {

                    await erc20Token
                        .connect(bob.secondarySigners[0])
                        .approve(formaturaContract.address, 1);

                    await expect( formaturaContract
                        .connect(bob.secondarySigners[0])
                        .payNextPayment(bobIndex)).to.changeTokenBalances(
                            erc20Token,
                            [bob.secondarySigners[0], formaturaContract],
                            [-1, 1]
                        );
                }
                
        
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
            }
        });


        it("Should revert because alice (main and secondary addresses) cannot pay bob's payments. Only bob can do it", async function() {
            const { members, formaturaContracts, erc20Token } = await loadFixture(contractApprovedFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
                const alice = members[1];
        
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
                const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
                
                if (await formaturaContract.getTokenType === 0) {
                    
                    await expect (formaturaContract
                        .connect(alice.signer)
                        .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
                    
                    await expect (formaturaContract
                        .connect(alice.secondarySigners[0])
                        .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
                }
                else {

                    await erc20Token
                        .connect(alice.signer)
                        .approve(formaturaContract.address, 1);

                    await expect (formaturaContract
                        .connect(alice.signer)
                        .payNextPayment(bobIndex)).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');
                    
                    await erc20Token
                        .connect(alice.secondarySigners[0])
                        .approve(formaturaContract.address, 1);
                    
                    await expect (formaturaContract
                        .connect(alice.secondarySigners[0])
                        .payNextPayment(bobIndex)).to.be.revertedWith('Only the main address or an allowed secondary address of a member can call this function');

                }
            }
        });


        it("Should revert because the transaction value is not equal to the payment value", async function() {
            
            const { members, formaturaContracts } = await loadFixture(contractApprovedFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
    
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
                
                if (await formaturaContract.getTokenType() === 0) {
                    
                    await expect (formaturaContract
                        .connect(bob.signer)
                        .payNextPayment(bobIndex, {value: 999})).to.be.revertedWith('The transaction value must be equal to the payment value');
                
                }
                else {

                    await expect (formaturaContract
                        .connect(bob.signer)
                        .payNextPayment(bobIndex)).to.be.revertedWith('This contract has not enough allowance to execute this payment');
                
                }  
            }
        });


        it("Should revert because there is no pending payments anymore", async function() {
            
            const { members, formaturaContracts, erc20Token } = await loadFixture(contractApprovedFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
    
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
                
                if (await formaturaContract.getTokenType() === 0) {
                    
                    await formaturaContract
                            .connect(bob.signer)
                            .payNextPayment(bobIndex, {value: 1});

                    await formaturaContract
                            .connect(bob.signer)
                            .payNextPayment(bobIndex, {value: 1});

                    await expect (formaturaContract
                            .connect(bob.signer)
                            .payNextPayment(bobIndex, {value: 1})).to.be.revertedWith('This member has not pending payments anymore');    

                }
                else {

                    await erc20Token
                            .connect(bob.signer)
                            .approve(formaturaContract.address, 3);

                    await formaturaContract
                            .connect(bob.signer)
                            .payNextPayment(bobIndex);

                    await formaturaContract
                            .connect(bob.signer)
                            .payNextPayment(bobIndex);

                    await expect (formaturaContract
                            .connect(bob.signer)
                            .payNextPayment(bobIndex)).to.be.revertedWith('This member has not pending payments anymore');    

                }
               
            }
            
        });

    });


    /*******************
        CONTEXT: Unit tests for FormaturaContract.proposeWithdraw( ... )
    *******************/
    context('METHOD: proposeWithdraw( ... )', function() {

        
        it("Should bob propose a withdraw", async function() {

            const { members, formaturaContracts, erc20Token } = await loadFixture(contractWithAllPaymentsDoneFixture);

            for (formaturaContract of formaturaContracts) {

                const bob = members[0];

                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);

                if (await formaturaContract.getTokenType() === 0) {
                    
                    await expect( formaturaContract
                        .connect(bob.signer)
                        .proposeWithdraw(bobIndex, 5, "To spend with the music group", bob._mainAddress))
                            .to.changeEtherBalances(
                                [bob.signer, formaturaContract],
                                [0, 0]
                            );
                }
                else {

                    await expect( formaturaContract
                        .connect(bob.signer)
                        .proposeWithdraw(bobIndex, 5, "To spend with the music group", bob._mainAddress))
                            .to.changeTokenBalances(
                                erc20Token,
                                [bob.signer, formaturaContract],
                                [0, 0]
                            );
                }

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
            }
        });

        it("Should revert because withdraw value is out of bounds", async function() {

            const { members, formaturaContracts } = await loadFixture(contractWithAllPaymentsDoneFixture);
            
            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
    
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
                
                await expect(formaturaContract
                    .connect(bob.signer)
                    .proposeWithdraw(bobIndex, 6, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdraw value must be equal or less than the maximum defined in this contract");
                
                await expect(formaturaContract
                    .connect(bob.signer)
                    .proposeWithdraw(bobIndex, 12, "To spend with the music group", bob._mainAddress)).to.be.revertedWith("Withdraw value must be equal or less than the contract balance");
            
            }
        });
    
    
        it("Should revert because withdraw value is out of bounds", async function() {
    
            const { members, formaturaContracts } = await loadFixture(contractWithAllPaymentsDoneFixture);
    
            for (formaturaContract of formaturaContracts) {
                
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
            
            }
        });
    

    });
    

    /*******************
        CONTEXT: Unit tests for FormaturaContract.authorizeWithdraw( ... )
    *******************/
    context('METHOD: authorizeWithdraw( ... )', function() { 

        it("Should alice authorize the two first withdrawals", async function () {

            const { members, formaturaContracts, erc20Token } = await loadFixture(proposedWithdrawalsFixture);

            for (formaturaContract of formaturaContracts) {
                
                const alice = members[1];
                const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                
                for (withdraw of proposedWithdrawals) {
                    expect(withdraw._authorized).to.equal(false);
                }
    
                if (await formaturaContract.getTokenType() === 0) {
                    expect (await formaturaContract
                        .connect(alice.signer)
                        .authorizeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.changeEtherBalances(
                            [alice.signer, formaturaContract],
                            [0, 0]
                        );
                }
                else {
                    expect (await formaturaContract
                        .connect(alice.signer)
                        .authorizeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.changeTokenBalances(
                            erc20Token,
                            [alice.signer, formaturaContract],
                            [0, 0]
                        );
                }
                
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
            }
        });


        it("Should revert because a member cannot authorize a withdraw twice", async function () {

            const { members, formaturaContracts } = await loadFixture(proposedWithdrawalsFixture);

            for (formaturaContract of formaturaContracts) {

                const bob = members[0];
                const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
    
                await expect(formaturaContract
                    .connect(bob.signer)
                    .authorizeWithdraw(bobIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("A member cannot authorize a withdraw twice");
                
            }           
        });
        

        it("Should revert because michael is not a committe member", async function () {

            const { members, formaturaContracts } = await loadFixture(proposedWithdrawalsFixture);

            for (formaturaContract of formaturaContracts) {

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
                
            }
        });


        it("Should revert because the function caller is not a member of this contract", async function () {

            const { members, notMember, formaturaContracts } = await loadFixture(proposedWithdrawalsFixture);

            for (formaturaContract of formaturaContracts) {

                const alice = members[1];
                const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
    
                let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
    
                await expect(formaturaContract
                    .connect(notMember.signer)
                    .authorizeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of a member can call this function");
                  
            }
        });

    });


    /*******************
        CONTEXT: Unit tests for FormaturaContract.executeWithdraw( ... )
    *******************/
        context('METHOD: executeWithdraw( ... )', function() {

            it("Should bob execute an authorized withdraw", async function () {

                const { members, formaturaContracts, erc20Token } = await loadFixture(authorizedWithdrawalsFixture);

                //const formaturaContract = formaturaContracts[1];
                for (formaturaContract of formaturaContracts) {

                    const bob = members[0];
                    const bobIndex = formaturaContract.getMemberIndex(bob._mainAddress);

                    let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
                    let executedWithdrawals = await formaturaContract.getExecutedWithdrawals();

                    expect(proposedWithdrawals.length).to.equal(3);
                    expect(executedWithdrawals.length).to.equal(0);

                    /* EXECUTING THE LAST WITHDRAW OF THE LIST */

                    if (await formaturaContract.getTokenType() === 0) {

                        await expect (formaturaContract
                            .connect(bob.signer)
                            .executeWithdraw(bobIndex, 2)).to.changeEtherBalances(
                                [bob.signer, formaturaContract],
                                [5, -5]
                            );
                    }
                    else {
                        await expect (formaturaContract
                            .connect(bob.signer)
                            .executeWithdraw(bobIndex, 2)).to.changeTokenBalances(
                                erc20Token,
                                [bob.signer, formaturaContract],
                                [5, -5]
                            );
                    }
                

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
                    if (await formaturaContract.getTokenType() === 0) {
                        await expect (formaturaContract
                            .connect(bob.signer)
                            .executeWithdraw(bobIndex, 0)).to.changeEtherBalances(
                                [bob.signer, formaturaContract],
                                [5, -5]
                            );
                    }
                    else {
                        await expect (formaturaContract
                            .connect(bob.signer)
                            .executeWithdraw(bobIndex, 0)).to.changeTokenBalances(
                                erc20Token,
                                [bob.signer, formaturaContract],
                                [5, -5]
                            );
                    }

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
               }
            });


            it("Should revert because there is not enough balance in this contract", async function () {

                const { members, formaturaContracts } = await loadFixture(authorizedWithdrawalsFixture);
    
                for (formaturaContract of formaturaContracts) {
                    
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
                }
            });


            it("Should revert because there is not enough balance in this contract", async function () {

                const { members, formaturaContracts } = await loadFixture(authorizedWithdrawalsFixture);
    
                for (formaturaContract of formaturaContracts) {
                    
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
                }
            });
            
    
            it("Should revert because michael is not a committe member", async function () {
    
                const { members, formaturaContracts } = await loadFixture(authorizedWithdrawalsFixture);
    
                for (formaturaContract of formaturaContracts) {

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
                    
                }
            });
    
    
            it("Should revert because the function caller is not a member of this contract", async function () {
    
                const { members, notMember, formaturaContracts } = await loadFixture(authorizedWithdrawalsFixture);
    
                for (formaturaContract of formaturaContracts) {

                    const alice = members[1];
                    const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);
        
                    let proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
        
                    await expect(formaturaContract
                        .connect(notMember.signer)
                        .executeWithdraw(aliceIndex, proposedWithdrawals[0]._id)).to.be.revertedWith("Only the main address of a member can call this function");
                }
            });

        });

});