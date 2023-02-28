exports.getMembers = async function() {
    
    const payments = [
        {_value: 1, _dueDate: 1, _paymentDate: 0}, 
        {_value: 1, _dueDate: 2, _paymentDate: 0}
    ];

    const [signer1, signer2, signer3, signer4, signer5, signer6] = await ethers.getSigners();

    const member1 = {
        _login: 'member1',
        _mainAddress: signer1.address,
        _secondaryAddresses: [],
        _contractApproved: false,
        _committeMember: true,
        _payments: payments
    };

    const member2 = {
        _login: 'member2',
        _mainAddress: signer2.address,
        _secondaryAddresses: [],
        _contractApproved: true,
        _committeMember: true,
        _payments: payments
    };

    const member3 = {
        _login: 'member3',
        _mainAddress: signer3.address,
        _secondaryAddresses: [],
        _contractApproved: false,
        _committeMember: true,
        _payments: payments
    };

    const member4 = {
        _login: 'member4',
        _mainAddress: signer4.address,
        _secondaryAddresses: [],
        _contractApproved: true,
        _committeMember: false,
        _payments: payments
    };

    const member5 = {
        _login: 'member5',
        _mainAddress: signer5.address,
        _secondaryAddresses: [],
        _contractApproved: false,
        _committeMember: false,
        _payments: payments
    };

    const member6 = {
        _login: 'member6',
        _mainAddress: signer6.address,
        _secondaryAddresses: [],
        _contractApproved: true,
        _committeMember: false,
        _payments: payments
    };

    const members = [member1, member2, member3, member4, member5, member6];

    return members;
}