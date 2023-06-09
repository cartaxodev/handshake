import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

function MemberListControllerClauses({ clauses, recalcNumberOfClauses }) {

    const clausesNumbers = clauses.filter((el) => {
        return el.param === "memberListController";
    })[0];

    const memberManagers = useSelector((state) => {
        return state.memberManagers.memberManagers_;
    });

    const memberList = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const minApprovalsToAddNewMember = useSelector((state) => {
        return state.minApprovalsToAddNewMember.minApprovalsToAddNewMember_;
    });

    const minApprovalsToRemoveMember = useSelector((state) => {
        return state.minApprovalsToRemoveMember.minApprovalsToRemoveMember_;
    });

    const managersDetails = memberList.filter((member, index) => {
        let manager = false;
        for (let memberManager of memberManagers) {
            if (member._id === memberManager) {
                manager = true;
                break;
            }
        }
        return manager;
    });

    const renderedMembers = managersDetails.map((member, index) => {
        return <Typography>
            <p/>
            - Login: <b>{member._login}</b> <br/> - Wallet: <b>{member._mainAddress}</b>
        </Typography>
    });

    return <div>
            <Typography align="center">
                <p/>
                <p/>                <p/>
                <b> DA ADMINISTRAÇÃO DE MEMBROS</b>
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[0]}: </b>{`A inclusão e a remoção de membros dos contratos pode ser solicitada por qualquer membro do contrato. Porém a aprovação da mudança só poderá ser realizada pelos administradores de membros;`}
            </Typography>
            <Typography>
                <p/>
                <b>§ 1º: </b>{`Para que uma INCLUSÃO de novo membro seja autorizada, é necessária a aprovação de pelo menos ${minApprovalsToAddNewMember} administradores;`}
            </Typography>
            <Typography>
                <p/>
                <b>§ 2º: </b>{`Para que uma EXCLUSÃO de membro seja autorizada, é necessária a aprovação de pelo menos ${minApprovalsToRemoveMember} administradores;`}
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[1]}: </b>{`São administradores de membros deste contrato:`}
            </Typography>
            {renderedMembers}
        </div>

}

export default MemberListControllerClauses;