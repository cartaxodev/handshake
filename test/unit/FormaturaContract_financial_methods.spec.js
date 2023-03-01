const chai = require('chai');
const BN = require('bn.js');
const { expect } = require('chai');
const membersMock = require('./mocks/MembersMock.js');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

describe("FormaturaContract's financial methods Unit Test", function () {

    before(async function () {

        [members, notMember] = await membersMock.getMembers();

        FormaturaContract = await ethers.getContractFactory('FormaturaContract');
        formaturaContract = await FormaturaContract.deploy(members, 2, 1);
        //await formaturaContract.deployed();
    });

    it("Should bob pay his first payment and alice doesn't", async function() {
        const bob = members[0];
        const alice = members[1];

        const bobIndex = await formaturaContract.getMemberIndex(bob._mainAddress);
        const aliceIndex = await formaturaContract.getMemberIndex(alice._mainAddress);

        await formaturaContract
                .connect(bob.signer)
                .payNextPayment_ETH(bobIndex, {value: 1});
        
        // console.log(result);

        const contractMembers = await formaturaContract.getMembers();
        const contractBob = contractMembers[bobIndex];
        const contractAlice = contractMembers[aliceIndex];

        expect(contractBob._payments[0]._paid).to.equal(true);
        expect(contractBob._payments[1]._paid).to.equal(false);

        expect(contractAlice._payments[0]._paid).to.equal(false);
        expect(contractAlice._payments[1]._paid).to.equal(false);
    });

});