const chai = require('chai');
const BN = require('bn.js');
const { expect } = require('chai');
const membersMock = require('./mocks/MembersMock.js');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

describe("FormaturaContract's constructor Unit Test", function () {

    before(async function () {

        const [members, ] = await membersMock.getMembers();

        FormaturaContract = await ethers.getContractFactory('FormaturaContractETH');
        formaturaContract = await FormaturaContract.deploy(members, 2, 1);
        //await formaturaContract.deployed();
    });

    it('Should have 5 members', async function() {
        const deployedMembers = await formaturaContract.getMembers();
        expect( deployedMembers.length ).to.equal(5);

        for (let i = 0; i < deployedMembers.length; i++) {
            expect(deployedMembers[i]._id).to.equal(i);
        }
    });

    it('Should have 3 committe members', async function() {
        const deployedMembers = await formaturaContract.getMembers();
        let committeMembersCount = 0;
        for (let member of deployedMembers) {
            if ( member._committeMember === true) {
                committeMembersCount++;
            }
        } 
        expect( committeMembersCount ).to.equal(3);
    });
    
    it("Should all members have not aproved the contract yet", async function() {
        const deployedMembers = await formaturaContract.getMembers();
        for (let member of deployedMembers) {
            expect( member._contractApproved ).to.equal(false);
        } 
    });

    it("Should all members have 2 pending payments", async function() {
        const deployedMembers = await formaturaContract.getMembers();
        for (let member of deployedMembers) {
            expect( member._payments.length ).to.equal(2);
        } 
    });

    it('Should the contract coin be equal do ETH (0)', async function() {
        const contractCoin = await formaturaContract.getContractCoin();
        expect(contractCoin).to.equal(0);
    });

    it('Should the minumum committe members needed to withdraw equal to 2', async function() {
        const minCommitteMembersToWithdraw = await formaturaContract.getMinCommitteMembersToWithdraw();
        expect(minCommitteMembersToWithdraw).to.equal(2);
    });

    it('Should the number of withdrawals equal do zero', async function() {
        const numberOfWithdrawals = await formaturaContract.getWithdrawalsCounter();
        expect(numberOfWithdrawals).to.equal(0);
    });

    it('Should the maximum value on a withdrawal equal to 1', async function() {
        const maxWithdrawValue = await formaturaContract.getMaxWithdrawValue();
        expect(maxWithdrawValue).to.equal(1);
    });

    it('Should the lists of proposed and aproved withdrawals be empty', async function() {
        const proposedWithdrawals = await formaturaContract.getProposedWithdrawals();
        const executedWithdrawals = await formaturaContract.getExecutedWithdrawals();
        expect(proposedWithdrawals.length).to.equal(0);
        expect(executedWithdrawals.length).to.equal(0);
    });

});