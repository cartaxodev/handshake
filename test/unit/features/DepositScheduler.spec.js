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
        
                // const contractMembers = await contract.getActiveMembers();
                // const contractBob = await contract.getMemberById(bobId);
        
                // expect(contractBob._deposits[0]._paid).to.equal(true);
                // expect(contractBob._deposits[0]._depositDate).to.greaterThan(0).and.to.lessThanOrEqual(await time.latest());
                // expect(contractBob._deposits[1]._paid).to.equal(false);
        
                // /* All the other members must to have all their deposits still pending */
                // for (let i = 0; i < contractMembers.length; i++) {
                //     if (i !== bobIndex) {
                //         contractMember = contractMembers[i];
                        
                //         for (deposit of contractMember._deposits) {
                //             expect(deposit._paid).to.equal(false);
                //         }
                //     }
                // }

            }
            
        });

    });
}

module.exports = {setFixtures, tests};