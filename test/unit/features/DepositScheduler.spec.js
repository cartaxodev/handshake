const chai = require('chai');
const { expect } = require('chai');
const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');


let _deployContractNotApprovedFixture;
let _contractApprovedFixture;


const setFixtures = function (deployContractNotApprovedFixture_, 
                              contractApprovedFixture_) {

    _deployContractNotApprovedFixture = deployContractNotApprovedFixture_;
    _contractApprovedFixture - contractApprovedFixture_;

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

    context('CONTEXT: DEPOSIT SCHEDULER INITIALIZATION', function () {

        it("Should  ......... ", async function() {
            
            const { members, concreteContracts, depositSchedule } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {
                
                for (member of members) {

                    
                }
            }
        });
    });
}

module.exports = {setFixtures, tests};