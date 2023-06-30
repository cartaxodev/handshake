import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

function WithdrawalControllerClauses({ clauses, recalcNumberOfClauses }) {

    const clausesNumbers = clauses.filter((el) => {
        return el.param === "withdrawalController";
    })[0];

    const withdrawalApprovers = useSelector((state) => {
        return state.withdrawalApprovers.withdrawalApprovers_;
    });

    const memberList = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const minApprovalsToWithdraw = useSelector((state) => {
        return state.minApprovalsToWithdraw.minApprovalsToWithdraw_;
    });

    const maxWithdrawValue = useSelector((state) => {
        return state.maxWithdrawValue.maxWithdrawValue_;
    });

    const approversDetails = memberList.filter((member, index) => {
        let manager = false;
        for (let approver of withdrawalApprovers) {
            if (member._id === approver) {
                manager = true;
                break;
            }
        }
        return manager;
    });

    const renderedMembers = approversDetails.map((member, index) => {
        return <Typography>
            <p/>
            - Login: <b>{member._login}</b> <br/> - Wallet: <b>{member._mainAddress}</b>
        </Typography>
    });

    return <div>
            <Typography align="center">
                <p/>
                <p/>                <p/>
                <b>DOS SAQUES</b>
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[0]}: </b>{`Os saques de valores deste contrato só podem ser realizados mediante solicitação justificada de um dos membros;`}
            </Typography>
            <Typography>
                <p/>
                <b>§ 1º: </b>{`Para solicitar um saque, o membro deve indicar o valor, a finalidade e a conta de destino;`}
            </Typography>
            <Typography>
                <p/>
                <b>§ 2º: </b>{`Para que um saque seja executado, é necessária a aprovação de pelo menos ${minApprovalsToWithdraw} administradores;`}
            </Typography>
            <Typography>
                <p/>
                <b>§ 3º: </b>{`O valor máximo autorizado por saquel é de ${maxWithdrawValue};`}
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[1]}: </b>{`São administradores com poderes de autorizar o saque de valores deste contrato os seguintes membros:`}
            </Typography>
            {renderedMembers}
        </div>

}

export default WithdrawalControllerClauses;