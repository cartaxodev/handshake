import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

function ObjectiveClauses({ clauses, recalcNumberOfClauses }) {

    const clausesNumbers = clauses.filter((el) => {
        return el.param === "objective_";
    })[0];

    const objective = useSelector((state) => {
        return state.objective.objective_;
    });

    return <div>
            <Typography align="center">
                <p/>
                <p/>
                <b> DO OBJETIVO</b>
            </Typography>
            <Typography>
                <p/>
                <b>CLÁUSULA ${clausesNumbers.paramClausesNumbers[0]}: </b>{`O objetivo deste contrato é realizar o/a ${objective};`}
            </Typography>
        </div>

}

export default ObjectiveClauses;