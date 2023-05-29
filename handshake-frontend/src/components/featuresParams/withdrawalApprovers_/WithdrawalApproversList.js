import WithdrawalApproverInput from "./WithdrawalApproverInput";

function WithdrawalApproversList ({ members, state, setState }) {

    const approversToRemove = [];
    for (let approver of state) {
        
        let memberFound = false;
        for (let member of members) {
            if (approver._id === member._id) {
                memberFound = true;
            }
        }
        if (!memberFound) {
            approversToRemove.push(approver);
        }
    }

    if (approversToRemove.length > 0) {
        const approvers = state.filter((approver) => {
            let remove = false;
            for (let a of approversToRemove) {
                if (approver._id === a._id) {
                    remove = true;
                }
            }
            return !remove;
        });
        setState("withdrawalApprovers_", approvers);
    }
    
    const addWithdrawalApprover = (memberId) => {
        const approvers = [];
        for (let approver of state) {
            approvers.push(approver);
        }

        for (let member of members) {
            if (member._id === memberId) {
                approvers.push({
                    _id: memberId
                });
            }
        }

        setState("withdrawalApprovers_", approvers);
    }

    const removeWithdrawalApprover = (memberId) => {
        const approvers = state.filter((approver) => {
            return (approver._id !== memberId);
        });

        setState("withdrawalApprovers_", approvers);
    }

    const isApprover = (memberId) => {
        let approver = false;
        for (let appr of state) {
            if (memberId === appr._id) {
                approver = true;
                break;
            }
        }
        return approver;
    }

    let renderedMembers;
    
    if (members !== "") {
        renderedMembers = members.map((member) => {
            return (
                <div key={member._id}>
                   <WithdrawalApproverInput member={member}
                                       isApprover={isApprover(member._id)}
                                       addWithdrawalApprover={addWithdrawalApprover}
                                       removeWithdrawalApprover={removeWithdrawalApprover}
                                       />
                </div>
            );
        });
    }

    return (
        <div>
            <p>Selecione abaixo quais dos membros poderão autorizar saques de valores do contrato:</p>
            {renderedMembers}
        </div>
    );
}

export default WithdrawalApproversList;