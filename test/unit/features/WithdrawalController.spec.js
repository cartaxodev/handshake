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

    const WithdrawalController_Logic_Factory = await ethers.getContractFactory('WithdrawalController_Logic');

    /*******************
           CONTEXT: WITHDRAWAL CONTROLLER INITIALIZATION
    *******************/
    context('CONTEXT: WITHDRAWAL CONTROLLER INITIALIZATION', function () {

        it("Should deposit scheduler proxy call the fallback function and delegate to the logic contract, returning the corret value", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {
                
                for (member of members) {

                    const withdrawalController = await WithdrawalController_Logic_Factory.attach(await contract._withdrawalController());

                    // expect((await depositScheduler.getMemberSchedule(member._id))[0]._value).to.equal(1);
                    // expect((await depositScheduler.getMemberSchedule(member._id))[0]._executionInfo._executed).to.equal(false);
                }
            }
        });
    });
}

module.exports = {setFixtures, tests};