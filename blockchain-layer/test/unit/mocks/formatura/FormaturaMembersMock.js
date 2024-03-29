exports.getMembers = async function() {
    
    const deposits = [
        {_value: 1, _dueDate: 1, _depositDate: 0, _paid: false}, 
        {_value: 1, _dueDate: 2, _depositDate: 0, _paid: false}
    ];

    const [signer1, signer2, signer3, signer4, signer5, signer6, signer7, signer8] = await ethers.getSigners();

    const member1 = {
        signer: signer1,
        secondarySigners: [signer7],
        _id: 0,
        _login: 'bob',
        _mainAddress: signer1.address,
        _secondaryAddresses: [signer7.address],
        _contractApproved: false,
        _committeMember: true,
        _deposits: deposits
    };

    const member2 = {
        signer: signer2,
        secondarySigners: [signer8],
        _id: 0,
        _login: 'alice',
        _mainAddress: signer2.address,
        _secondaryAddresses: [signer8.address],
        _contractApproved: true,
        _committeMember: true,
        _deposits: deposits
    };

    const member3 = {
        signer: signer3,
        _id: 0,
        _login: 'john',
        _mainAddress: signer3.address,
        _secondaryAddresses: [],
        _contractApproved: false,
        _committeMember: true,
        _deposits: deposits
    };

    const member4 = {
        signer: signer4,
        _id: 0,
        _login: 'michael',
        _mainAddress: signer4.address,
        _secondaryAddresses: [],
        _contractApproved: true,
        _committeMember: false,
        _deposits: deposits
    };

    const member5 = {
        signer: signer5,
        _id: 0,
        _login: 'katie',
        _mainAddress: signer5.address,
        _secondaryAddresses: [],
        _contractApproved: false,
        _committeMember: false,
        _deposits: deposits
    };

    const notMember = {
        signer: signer6,
        _id: 0,
        _login: '(not a member)',
        _mainAddress: signer6.address,
        _secondaryAddresses: [],
        _contractApproved: true,
        _committeMember: false,
        _deposits: deposits
    };

    const members = [member1, member2, member3, member4, member5];

    return [members, notMember];
}