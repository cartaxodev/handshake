
exports.getConstructorParams = () => {
    return [
        {
            name: "depositSchedule_",
            defaultValue: []
        },
        {
            name: "deadlineControlConfig_",
            defaultValue: {
                _isControlActive: false,
                _dailyFee: 0,
                _weeklyFee: 0,
                _monthlyFee: 0
            }
        }
    ]
}