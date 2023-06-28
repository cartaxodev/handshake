import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

function MemberListClauses({ clauses, recalcNumberOfClauses }) {

    const clausesNumbers = clauses.filter((el) => {
        return el.param === "memberList_";
    })[0];

    const memberList = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const renderedMembers = memberList.map((member, index) => {
        return <Typography>
            <p/>
            - Login: <b>{member._login}</b> <br/> - Wallet: <b>{member._mainAddress}</b>
        </Typography>
    });

    return <div>
            <Typography align="center">
                <p/>
                <p/>
                <b> DOS MEMBROS</b>
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[0]}: </b>{`São membros do contrato os donos das WALLETS abaixo listadas, identificados neste contrato pelos LOGINS correspondentes:`}
            </Typography>
            {renderedMembers}
            <Typography>
                <p/>
                <b>§ 1º: </b>O membro só será considerado ativo no contrato após a sua aprovação digital, realizada pelo acesso à função "approveTheContract" do contrato inteligente disponibilizado.
            </Typography>
            <Typography>
                <p/>
                <b>§ 2º: </b>Este contrato só será considerado "ativo" após a aprovação de todos os membros listados no caput.
            </Typography>
        </div>

}

export default MemberListClauses;