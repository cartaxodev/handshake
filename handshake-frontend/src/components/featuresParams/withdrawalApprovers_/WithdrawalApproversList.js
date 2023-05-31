import WithdrawalApproverInput from "./WithdrawalApproverInput";
import { useSelector } from 'react-redux';

function WithdrawalApproversList () {

    const members = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const withdrawalApprovers = useSelector((state) => {
        return state.withdrawalApprovers.withdrawalApprovers_;
    });

    const isApprover = (memberId) => {
        let approver = false;
        for (let appr of withdrawalApprovers) {
            if (memberId === appr) {
                approver = true;
                break;
            }
        }
        return approver;
    }

    let renderedMembers = members.map((member) => {
        return (
            <div key={member._id}>
                <WithdrawalApproverInput member={member}
                                    isApprover={isApprover(member._id)}
                                    />
            </div>
        );
    });

    return (
        <div>
            <p>Selecione abaixo quais dos membros poderão autorizar saques de valores do contrato:</p>
            {renderedMembers}
        </div>
    );
}

export default WithdrawalApproversList;