
exports.getMembers = async function() {

    const [signer1, signer2, signer3, signer4, signer5, signer6, signer7, signer8] = await ethers.getSigners();

    const member1 = {
        signer: signer1,
        secondarySigners: [signer7],
        _id: 0,
        _login: 'bob',
        _mainAddress: signer1.address,
        _secondaryAddresses: [signer7.address]
    };

    const member2 = {
        signer: signer2,
        secondarySigners: [signer8],
        _id: 1,
        _login: 'alice',
        _mainAddress: signer2.address,
        _secondaryAddresses: [signer8.address]
    };

    const member3 = {
        signer: signer3,
        _id: 2,
        _login: 'john',
        _mainAddress: signer3.address,
        _secondaryAddresses: []
    };

    const member4 = {
        signer: signer4,
        _id: 3,
        _login: 'michael',
        _mainAddress: signer4.address,
        _secondaryAddresses: []
    };

    const member5 = {
        signer: signer5,
        _id: 4,
        _login: 'katie',
        _mainAddress: signer5.address,
        _secondaryAddresses: []
    };

    const notMember = {
        signer: signer6,
        _id: 0,
        _login: '(not a member)',
        _mainAddress: signer6.address,
        _secondaryAddresses: []
    };

    const members = [member1, member2, member3, member4, member5];

    return [members, notMember];
}


exports.getMemberManagers = async function() {

    const [members] = await this.getMembers();

    const memberManagers = [members[0]._mainAddress, members[1]._mainAddress, members[2]._mainAddress ]

    return memberManagers;
}