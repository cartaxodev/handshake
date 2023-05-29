
exports.getConstructorParams = () => {
    return [
        {
            name: "memberManagers_",
            defaultValue: []
        }, 
        {
            name: "minApprovalsToAddNewMember_",
            defaultValue: 0
        },
        {
            name: "minApprovalsToRemoveMember_",
            defaultValue: 0
        }
    ]
}