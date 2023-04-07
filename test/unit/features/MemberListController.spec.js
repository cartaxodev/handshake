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

    const MemberListController_Logic_Factory = await ethers.getContractFactory('MemberListController_Logic');

/*******************
    CONTEXT: CONTRACT MEMBERS MANAGEMENT
*******************/
    context('CONTEXT: CONTRACT MEMBERS MANAGEMENT', function () {

        it("Should contract have 3 member managers", async function() {
            
            // const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            // for (contract of concreteContracts) {

            //     const MEMBER_MANAGER_ROLE = await contract.MEMBER_MANAGER_ROLE();
                
            //     const deployedMembers = await contract.getActiveMembers();
            //     let managersCount = 0;

            //     for (member of deployedMembers) {
            //         if (await contract.hasRole(MEMBER_MANAGER_ROLE, member._mainAddress) === true) {
            //             managersCount++;
            //         }
            //     }

            //     expect(managersCount).to.equal(3);
            // }
        });

        it("Should a member manager propose a member inclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member inclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member inclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should a member manager approve a member inclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on approving a member inclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on approving a member inclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should a member manager propose a member exclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member exclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member exclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should a member manager approve a member exclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on approving a member exclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement
            }
        });

        it("Should revert on approving a member exclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const memberListController = await MemberListController_Logic_Factory.attach(await contract._memberListController());
                //TODO: Implement 
            }
        });
        
    });
}

module.exports = {setFixtures, tests};
    