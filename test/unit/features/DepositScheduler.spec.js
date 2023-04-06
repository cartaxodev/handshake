const chai = require('chai');
const { expect } = require('chai');
const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');


let _deployContractNotApprovedFixture;
let _contractApprovedFixture;


const setFixtures = function (deployContractNotApprovedFixture_, 
                              contractApprovedFixture_) {

    _deployContractNotApprovedFixture = deployContractNotApprovedFixture_;
    _contractApprovedFixture = contractApprovedFixture_;

}

const tests = async function () {

    const DepositScheduler_Logic_Factory = await ethers.getContractFactory('DepositScheduler_Logic');

    /*******************
           CONTEXT: DEPOSIT SCHEDULER INITIALIZATION
    *******************/
    context('CONTEXT: DEPOSIT SCHEDULER INITIALIZATION', function () {

        it("Should deposit scheduler proxy call the fallback function and delegate to the logic contract, returning the corret value", async function() {
            
            const { members, concreteContracts, depositSchedule } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {
                
                for (member of members) {

                    const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());
                    
                    expect((await depositScheduler.getMemberSchedule(member._id))[0]._value).to.equal(1);
                    expect((await depositScheduler.getMemberSchedule(member._id))[0]._executionInfo._executed).to.equal(false);
                }
            }
        });
    });

    /*******************
           CONTEXT: PAYING SCHEDULED DEPOSITS
    *******************/
    context('CONTEXT: PAYING SCHEDULED DEPOSITS', function () {

        it("Should revert because the contract is not aproved for all members yet", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {
                
                const bob = members[0];
        
                const bobId = await contract.getMemberId(bob._mainAddress);
                const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());
                
                if (await contract.getTokenType() === 0) {
                    
                    await expect (depositScheduler
                        .connect(bob.signer)
                        .payNextDeposit(bobId, {value: 1})).to.be.revertedWith('This contract is not aproved by all active members');

                } else {

                    await expect (depositScheduler
                        .connect(bob.signer)
                        .payNextDeposit(bobId)).to.be.revertedWith('This contract is not aproved by all active members');

                }
            }
        });


        it("Should bob pay his first deposit with main address", async function() {
            
            const { members, concreteContracts, erc20Token } = await loadFixture(_contractApprovedFixture);
            
            for (contract of concreteContracts) {

                const bob = members[0];
    
                const bobId = await contract.getMemberId(bob._mainAddress);
                const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());
        
                if (await contract.getTokenType() === 0) {

                    await expect( depositScheduler
                        .connect(bob.signer)
                        .payNextDeposit(bobId, {value: 1})).to.changeEtherBalances(
                            [bob.signer, contract],
                            [-1, 1]
                        );
                }
                else {

                    await erc20Token
                            .connect(bob.signer)
                            .approve(contract.address, 1);
                    
                    await expect( depositScheduler
                        .connect(bob.signer)
                        .payNextDeposit(bobId)).to.changeTokenBalances(
                            erc20Token,
                            [bob.signer, contract],
                            [-1, 1]
                        );
                }
                const contractMembers = await contract.getActiveMembers();
                const bobDepositSchedule = await depositScheduler.getMemberSchedule(bobId);
        
                expect(bobDepositSchedule[0]._executionInfo._executed).to.equal(true);
                expect(bobDepositSchedule[0]._executionInfo._executionTimestamp).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                expect(bobDepositSchedule[1]._executionInfo._executed).to.equal(false);
        
                /* All the other members must to have all their deposits still pending */
                for (let i = 0; i < contractMembers.length; i++) {
                    const contractMember = contractMembers[i];
                    if (contractMember._mainAddress !== bob._mainAddress) {
                        
                        for (deposit of await depositScheduler.getMemberSchedule(contractMember._id)) {
                            expect(deposit._executionInfo._executed).to.equal(false);
                        }
                    }
                }
            }
        });

        it("Should revert because alice (main and secondary addresses) cannot pay bob's deposits. Only bob can do it", async function() {
            const { members, concreteContracts, erc20Token } = await loadFixture(_contractApprovedFixture);
            
            for (contract of concreteContracts) {

                const bob = members[0];
                const alice = members[1];
        
                const bobId = await contract.getMemberId(bob._mainAddress);
                const aliceId = await contract.getMemberId(alice._mainAddress);

                const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());
        
                
                if (await contract.getTokenType === 0) {
                    
                    await expect (depositScheduler
                        .connect(alice.signer)
                        .payNextDeposit(bobId, {value: 1})).to.be.revertedWith('Only the main address of an active member can call this function');
                    
                    await expect (depositScheduler
                        .connect(alice.secondarySigners[0])
                        .payNextDeposit(bobId, {value: 1})).to.be.revertedWith('Only the main address of an active member can call this function');
                }
                else {

                    await erc20Token
                        .connect(alice.signer)
                        .approve(contract.address, 1);

                    await expect (depositScheduler
                        .connect(alice.signer)
                        .payNextDeposit(bobId)).to.be.revertedWith('Only the main address of an active member can call this function');
                    
                    await erc20Token
                        .connect(alice.secondarySigners[0])
                        .approve(contract.address, 1);
                    
                    await expect (depositScheduler
                        .connect(alice.secondarySigners[0])
                        .payNextDeposit(bobId)).to.be.revertedWith('Only the main address of an active member can call this function');

                }
            }
        });


        it("Should revert because the transaction value is not equal to the deposit value", async function() {
            
            const { members, concreteContracts } = await loadFixture(_contractApprovedFixture);
            
            for (contract of concreteContracts) {

                const bob = members[0];
    
                const bobId = await contract.getMemberId(bob._mainAddress);
                const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());
                
                if (await contract.getTokenType() === 0) {
                    
                    await expect (depositScheduler
                        .connect(bob.signer)
                        .payNextDeposit(bobId, {value: 999})).to.be.revertedWith('The transaction value must be equal to the deposit value');
                
                }
                else {

                    await expect (depositScheduler
                        .connect(bob.signer)
                        .payNextDeposit(bobId)).to.be.revertedWith('This contract has not enough allowance to execute this deposit');
                
                }  
            }
        });


        it("Should revert because there is no pending deposits anymore", async function() {
            
            const { members, concreteContracts, erc20Token } = await loadFixture(_contractApprovedFixture);
            
            for (contract of concreteContracts) {

                const bob = members[0];
                const depositScheduler = await DepositScheduler_Logic_Factory.attach(await contract._depositScheduler());
                
                const bobId = await contract.getMemberId(bob._mainAddress);
                
                if (await contract.getTokenType() === 0) {
                    
                    await depositScheduler
                            .connect(bob.signer)
                            .payNextDeposit(bobId, {value: 1});

                    await depositScheduler
                            .connect(bob.signer)
                            .payNextDeposit(bobId, {value: 1});

                    await expect (depositScheduler
                            .connect(bob.signer)
                            .payNextDeposit(bobId, {value: 1})).to.be.revertedWith('This member has not pending deposits anymore');    

                }
                else {

                    await erc20Token
                            .connect(bob.signer)
                            .approve(contract.address, 3);

                    await depositScheduler
                            .connect(bob.signer)
                            .payNextDeposit(bobId);

                    await depositScheduler
                            .connect(bob.signer)
                            .payNextDeposit(bobId);

                    await expect (depositScheduler
                            .connect(bob.signer)
                            .payNextDeposit(bobId)).to.be.revertedWith('This member has not pending deposits anymore');    

                }
               
            }
            
        });

    });
}

module.exports = {setFixtures, tests};