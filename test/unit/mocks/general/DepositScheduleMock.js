const membersMock = require("./MembersMock");

exports.getDepositSchedule = async function() {

    const [members] = await membersMock.getMembers();
    let depositSchedule = [];

    for (member of members) {

        //Parcela 1
        depositSchedule.push({
            _memberId: member._id,
            _value: 1,
            _deadlineTimestamp: 0,  /* TODO: Criar timestamps reais utilizando as libs do hardhat de manipulação de tempo */
            _executionInfo: {
                _executed: false,
                _principalValue: 1,
                _lateDepositFee: 0,
                _finalValue: 1, 
                _depositId: 0
            }
        });

        //Parcela 2
        depositSchedule.push({
            _memberId: member._id,
            _value: 1,
            _deadlineTimestamp: 0,  /* TODO: Criar timestamps reais utilizando as libs do hardhat de manipulação de tempo */
            _executionInfo: {
                _executed: false,
                _principalValue: 1,
                _lateDepositFee: 0,
                _finalValue: 1, 
                _depositId: 0
            }
        });
    }

    return depositSchedule;
}