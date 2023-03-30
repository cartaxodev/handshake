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

    /*******************
        CONTEXT: CONTRACT APPROVAL
    *******************/
    context('CONTEXT: CONTRACT APPROVAL', function () {

        it("Should all members approve the contract", async function() {
            
            const { members, graduationQuotas } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of graduationQuotas) {
                
                for (member of members) {

                    const memberIndex = await contract.getMemberIndex(member._mainAddress);

                        expect(await contract.isContractApproved()).to.equal(false);
                        expect(await contract.getMemberApproval(memberIndex)).to.equal(false);

                        await contract
                            .connect(member.signer)
                            .approveTheContract(memberIndex);

                        expect(await contract.getMemberApproval(memberIndex)).to.equal(true);
                }

                expect(await contract.isContractApproved()).to.equal(true);
            }
        });
    });
}

module.exports = {setFixtures, tests};