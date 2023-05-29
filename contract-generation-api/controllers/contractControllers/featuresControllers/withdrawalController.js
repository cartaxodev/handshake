
exports.getConstructorParams = () => {
    return [
        {
            name: "withdrawalApprovers_",
            defaultValue: []
        }, 
        {
            name: "minApprovalsToWithdraw_",
            defaultValue: 0
        },
        {
            name: "maxWithdrawValue_",
            defaultValue: 0
        }
     ]
}