import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

function DepositSchedulerClauses({ clauses, recalcNumberOfClauses }) {

    const clausesNumbers = clauses.filter((el) => {
        return el.param === "depositScheduler";
    })[0];

    const memberList = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const depositSchedule = useSelector((state) => {
        return state.depositSchedule.depositSchedule_;
    });

    const deadlineControlConfig = useSelector((state) => {
        return state.deadlineControlConfig.deadlineControlConfig_;
    });

    const calcTotalValue = function () {

        let total = 0;

        for (let d of depositSchedule) {
            total += d._value;
        }

        return (total * memberList.length);
    };

    const deadlineControlClause = function () {
        if (deadlineControlConfig._isControlActive) {
            let text = "Em caso de atraso no pagamento de alguma das parcelas, será aplicada multa proporcional ao período de atraso, conforme os seguintes percentuais:";
            if (deadlineControlConfig._dailyFee > 0) {
                text += `
                Multa Diária: ${deadlineControlConfig._dailyFee}%`
            }
            if (deadlineControlConfig._weeklyFee > 0) {
                text += `
                Multa Semanal: ${deadlineControlConfig._dailyFee}%`
            }
            if (deadlineControlConfig._monthlyFee > 0) {
                text += `
                Multa Mensal: ${deadlineControlConfig._dailyFee}%`
            }
            return text;
        } else {
            return `O atraso no pagamento de alguma parcela específica não gera penalidades automáticas neste contrato.`;
        }
    }

    const renderedDeposits = depositSchedule.map((scheduling, index) => {
        return <Typography>
            <p/>
            - Vencimento: <b>{new dayjs.unix(scheduling._deadlineTimestamp).format('YYYY-MM-DD')}</b> <br/> - Valor: <b>{scheduling._value}</b>
        </Typography>
    });

    return <div>
            <Typography align="center">
                <p/>
                <p/>                <p/>
                <b> DOS DEPÓSITOS</b>
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[0]}: </b>
                {`Para o atingimento do objeto do contrato, os membros do contrato se obrigam a arrecadar a quantia de ${calcTotalValue()} unidades da moeda corrente deste contrato, a serem depositadas por cada membro de acordo com o seguinte cronograma:`}
            </Typography>
            {renderedDeposits}
            
            <Typography>
                <p/>
                <b>CLÁUSULA {clausesNumbers.paramClausesNumbers[1]}: </b>
                {deadlineControlClause()}
            </Typography>
            
        </div>
}

export default DepositSchedulerClauses;