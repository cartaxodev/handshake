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

const tests = function () {

    /*******************
           CONTEXT
    *******************/
        context('METHOD: getMemberSchedule( ... )', function () {

            it("Should all members approve the contract", async function() {
                
                const { members, graduationQuotas, depositSchedule } = await loadFixture(_deployContractNotApprovedFixture);
                
                for (contract of graduationQuotas) {
                    
                    for (member of members) {

                        expect(await contract._depositScheduler.getMemberSchedule(member._id)._value).to.equal(1);
                    }
                }
            });
        });
}

module.exports = {setFixtures, tests};