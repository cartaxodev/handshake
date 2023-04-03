const chai = require('chai');
const { expect } = require('chai');
const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');


let _deployContractNotApprovedFixture;
let _contractApprovedFixture;


const setFixtures = function (deployContractNotApprovedFixture_, 
                              contractApprovedFixture_) {

    _deployContractNotApprovedFixture = deployContractNotApprovedFixture_;
    _contractApprovedFixture - contractApprovedFixture_;

}

const tests = async function () {

    /*******************
        CONTEXT: HANDSHAKE SUPERCLASS INITIALIZATION
    *******************/
    context('CONTEXT: HANDSHAKE SUPERCLASS INITIALIZATION', function () {

        it("Shold revert because an address is used by more than one member", async function() {

            const { members, memberManagers } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            const alice = members[1];
            bob._secondaryAddresses.push(alice._mainAddress);

            const PureHandshakeFactory = await ethers.getContractFactory('PureHandshake');
            await expect (PureHandshakeFactory.deploy("To get funds to graduation party",
                                                                members,
                                                                memberManagers)).to.be.revertedWith("This address is already in use");
            bob._secondaryAddresses.pop();
        });

        it("Shold revert because an address is used by more than one member", async function() {

            const { members, memberManagers } = await loadFixture(_deployContractNotApprovedFixture);

            
            const bob = members[0];
            const bobMainAddress = bob._mainAddress;
            const alice = members[1];
            bob._mainAddress = alice._mainAddress;

            const PureHandshakeFactory = await ethers.getContractFactory('PureHandshake');
            await expect (PureHandshakeFactory.deploy("To get funds to graduation party",
                                                                members,
                                                                memberManagers)).to.be.revertedWith("This address is already in use");

            bob._mainAddress = bobMainAddress;
        });

        it("Should objetive be correctly registered", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                const deposits = await contract.getDeposits();
                const withdrawals = await contract.getWithdrawals();

                expect(deposits.length).to.equal(0);
                expect(withdrawals.length).to.equal(0);
            }
        });
        
        it("Should contract have 5 members", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {
                
                const deployedMembers = await contract.getActiveMembers();
                expect(deployedMembers.length).to.equal(5);

                for (let i = 0; i < deployedMembers.length; i++) {
                    expect(deployedMembers[i]._id).to.equal(i);
                }
            }
        });

        it("Should contract have 3 member managers", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                const MEMBER_MANAGER_ROLE = await contract.MEMBER_MANAGER_ROLE();
                
                const deployedMembers = await contract.getActiveMembers();
                let managersCount = 0;

                for (member of deployedMembers) {
                    if (await contract.hasRole(MEMBER_MANAGER_ROLE, member._mainAddress) === true) {
                        managersCount++;
                    }
                }

                expect(managersCount).to.equal(3);
            }
        });

        it("Should deposits and withdrawals arrays be empty", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                const deposits = await contract.getDeposits();
                const withdrawals = await contract.getWithdrawals();

                expect(deposits.length).to.equal(0);
                expect(withdrawals.length).to.equal(0);
            }
        });
    });

    /*******************
        CONTEXT: CONTRACT APPROVAL
    *******************/
    context('CONTEXT: CONTRACT APPROVAL', function () {

        it("Should all members approve the contract", async function() {
            
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                for (member of members) {

                    const memberId = await contract.getMemberId(member._mainAddress);

                    expect(await contract.isContractApproved()).to.equal(false);
                    expect(await contract.getMemberApproval(memberId)).to.equal(false);

                    await contract
                        .connect(member.signer)
                        .approveTheContract(memberId);

                    expect(await contract.getMemberApproval(memberId)).to.equal(true);
                }

                expect(await contract.isContractApproved()).to.equal(true);
            }
        });
    });

    /*******************
        CONTEXT: MEMBER SELF ACCOUNT MANAGEMENT
    *******************/
    context('CONTEXT: MEMBER SELF ACCOUNT MANAGEMENT', function () {

        it("Should a member be able to change his own main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            const bobMainAddress = bob._mainAddress;
            const bobSecondaryAddress = bob._secondaryAddresses[0];

            for (contract of concreteContracts) {
                const bobId = await contract.getMemberId(bob._mainAddress);
                await contract.connect(bob.secondarySigners[0]).changeMainAddress(bobId);

                const contractMembers = await contract.getActiveMembers();
                expect(contractMembers[bobId]._mainAddress).to.equal(bobSecondaryAddress);
            }
        });

        it("Should revert because is not using secondary address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            const bobId = await contract.getMemberId(bob._mainAddress);

            for (contract of concreteContracts) {
                await expect(contract
                                .connect(bob.signer)
                                .changeMainAddress(bobId))
                                .to.be.revertedWith("Only an allowed secondary address of an active member can call this function");
            }
        });

        it("Should revert on trying to change another member's main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            const alice = members[1];
            const bobId = await contract.getMemberId(bob._mainAddress);

            for (contract of concreteContracts) {
                await expect(contract
                            .connect(alice.signer)
                            .changeMainAddress(bobId))
                            .to.be.revertedWith("Only an allowed secondary address of an active member can call this function");
               
            }
        });

        it("Should a member be able to add and remove a secondary address", async function() {
            const { members, notMember, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            const bobId = await contract.getMemberId(bob._mainAddress);

            for (contract of concreteContracts) {
                //ADD
                await contract.connect(bob.signer).addSecondaryAddress(bobId, notMember._mainAddress);
                let contractMembers = await contract.getActiveMembers();
                
                let addressAdded = false;

                for (address of contractMembers[bobId]._secondaryAddresses) {
                    if (address === notMember._mainAddress) {
                        addressAdded = true;
                    }
                }

                expect (contractMembers[bobId]._secondaryAddresses.length).to.equal(2);
                expect (addressAdded).of.equal(true);

                //REMOVE
                await contract.connect(bob.signer).removeSecondaryAddress (bobId, notMember._mainAddress);
                contractMembers = await contract.getActiveMembers();

                addressAdded = false;

                for (address of contractMembers[bobId]._secondaryAddresses) {
                    if (address === notMember._mainAddress) {
                        addressAdded = true;
                    }
                }

                expect (contractMembers[bobId]._secondaryAddresses.length).to.equal(1);
                expect (addressAdded).of.equal(false);
            }
        });

        it("Should revert on trying to add or remove another member's secondary addresses", async function() {
            const { members, notMember, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            bobId = await contract.getMemberId(bob._mainAddress);
            const alice = members[1];

            for (contract of concreteContracts) {
                await expect (contract
                                    .connect(alice.signer)
                                    .addSecondaryAddress(bobId, notMember._mainAddress))
                                    .to.be.revertedWith("Only the main address of an active member can call this function");
            }
        });

        it("Should revert on trying to add an already used address", async function() {
            const { members, notMember, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            bobId = await contract.getMemberId(bob._mainAddress);

            for (contract of concreteContracts) {
                await expect (contract
                                    .connect(bob.signer)
                                    .addSecondaryAddress(bobId, bob._mainAddress))
                                    .to.be.revertedWith("This address is already in use");
            }
        });

        it("Should revert on trying to remove an unregistered secondary address", async function() {
            const { members, notMember, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            const bob = members[0];
            bobId = await contract.getMemberId(bob._mainAddress);

            for (contract of concreteContracts) {
                await expect (contract
                                    .connect(bob.signer)
                                    .removeSecondaryAddress(bobId, notMember._mainAddress))
                                    .to.be.revertedWith("Address not found");
            }
        });
    });

    /*******************
        CONTEXT: CONTRACT MEMBERS MANAGEMENT
    *******************/
    context('CONTEXT: CONTRACT MEMBERS MANAGEMENT', function () {

        it("Should a member manager propose a member inclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member inclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member inclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should a member manager approve a member inclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on approving a member inclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on approving a member inclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should a member manager propose a member exclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member exclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on proposing a member exclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should a member manager approve a member exclusion", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on approving a member exclusion because the member is not using his main address", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement
            }
        });

        it("Should revert on approving a member exclusion because the member is not a member manager", async function() {
            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {
                //TODO: Implement 
            }
        });
        
    });

    /*******************
        CONTEXT: FUNCTIONS WITH ONLY INTERNAL FEATURE ACCESS
    *******************/
    context('CONTEXT: FUNCTIONS WITH ONLY INTERNAL FEATURE ACCESS', function () {

        it("Should a registered feature-contract be able to access controlled functions", async function() {
            //_checkSecondaryAddress
            //_registerDeposit
            //_registerWithdrawal
            //_deposit
            //_withdraw

            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);
            
            for (contract of concreteContracts) {

                const allowedFeatures = await contract.getFeatureProxies();

                for (feature of allowedFeatures) {
                    const bob = members[0];
                    const featureSigner = await contract.provider.getSigner(feature);
                    
                    //_checkSecondaryAddress
                    expect (await contract.connect(featureSigner)._checkSecondaryAddress(0, feature)).to.equal(false);

                    //_registerDeposit (TODO: PESQUISAR PORQUE ESTÁ DANDO ERRO)
                    // console.log(feature);
                    // const depositId = await contract.connect(featureSigner)._registerDeposit(bob._mainAddress, 1, 0, {});
                    // expect(depositId).to.equal(0);
                }

            }
        });

        it("Should revert because is not an allowed feature-contract", async function() {
            //_checkSecondaryAddress
            //_registerDeposit
            //_registerWithdrawal
            //_deposit
            //_withdraw

            const { members, concreteContracts } = await loadFixture(_deployContractNotApprovedFixture);

            for (contract of concreteContracts) {

                const bob = members[0];

                await expect (contract.connect(bob.signer)._checkSecondaryAddress(0, bob._mainAddress)).to.be.revertedWith("Only internal features can call this function");
                await expect (contract.connect(bob.signer)._registerDeposit(bob._mainAddress, 1, 0)).to.be.revertedWith("Only internal features can call this function");
                await expect (contract.connect(bob.signer)._registerWithdrawal(bob._mainAddress, 1, 0)).to.be.revertedWith("Only internal features can call this function");
                await expect (contract.connect(bob.signer)._deposit(bob._mainAddress, {value: 1})).to.be.revertedWith("Only internal features can call this function");
                await expect (contract.connect(bob.signer)._withdraw(bob._mainAddress, 1)).to.be.revertedWith("Only internal features can call this function");
            }
        });
    });
}

module.exports = {setFixtures, tests};