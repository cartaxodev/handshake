import { useState } from "react";

import ObjectiveClauses from "./nativeParams/ObjectiveClauses";
import MemberListClauses from "./nativeParams/MemberListClauses";
import MemberListControllerClauses from "./features/MemberListControllerClauses";
import DepositSchedulerClauses from "./features/DepositSchedulerClauses";
import WithdrawalControllerClauses from "./features/WithdrawalControllerClauses";

//MUI
import { Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const initialClauses = [
    {
        param: "objective_",
        numClauses: 1,
        paramClausesNumbers: [1]
    },
    {
        param: "memberList_",
        numClauses: 1,
        paramClausesNumbers: [2]
    },
    {
        param: "memberListController",
        numClauses: 2,
        paramClausesNumbers: [3, 4]
    },
    {
        param: "depositScheduler",
        numClauses: 2,
        paramClausesNumbers: [5, 6]
    },
    {
        param: "withdrawalController",
        numClauses: 2,
        paramClausesNumbers: [7, 8]
    }
]

function ContractTextPanel({ contractTemplate }) {

    const [clauses, setClauses] = useState(initialClauses);

    const recalcNumberOfClauses = (param, number) => {

        let newClauses = [];
        let counter = 1;

        for (let clause of clauses) {

            const newClause = {
                param: clause.param,
                numClauses: clause.numClauses,
                paramClausesNumbers: []
            }

            if (newClause.param === param) {
                newClause.numClauses = number;
            }

            for (let i = 0; i < newClause.numClauses; i++) {
                newClause.paramClausesNumbers.push(counter++);
            }

            newClauses.push(newClause);
        }

        setClauses(newClauses);
    };

    let nativeParamsClauses;
    let featuresClauses;

    if (contractTemplate.nativeParams) {
        nativeParamsClauses = contractTemplate.nativeParams.map((param, index) => {
            if (param.name === "objective_") {

                return (
                    <div>
                        <ObjectiveClauses 
                            key={param.name}
                            clauses={clauses}
                            recalcNumberOfClauses={recalcNumberOfClauses}
                            />
                    </div>
                );
            }
            else if (param.name === "memberList_") {

                return (
                    <div>
                        <MemberListClauses 
                            key={param.name}
                            clauses={clauses}
                            recalcNumberOfClauses={recalcNumberOfClauses}
                            />
                    </div>
                );
            }
            else return undefined;
        });
    }

    if (contractTemplate.features) {
        featuresClauses = contractTemplate.features.map((feature, index) => {
            if (feature.name === "memberListController") {
                return (
                    <div>
                        <MemberListControllerClauses 
                        key={feature.name}
                        clauses={clauses}
                        recalcNumberOfClauses={recalcNumberOfClauses}/>
                    </div>
                );
            }
            else if (feature.name === "depositScheduler") {
                return (
                    <div>
                        <DepositSchedulerClauses 
                            key={feature.name}
                            clauses={clauses}
                            recalcNumberOfClauses={recalcNumberOfClauses}/>
                    </div>
                );
            }
            else if (feature.name === "withdrawalController") {
                return (
                    <div>
                        <WithdrawalControllerClauses 
                            key={feature.name}
                            clauses={clauses}
                            recalcNumberOfClauses={recalcNumberOfClauses}/>
                    </div>
                )
            }
            else return undefined;
        });
    }


    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>
                        <b>TEXTO DO CONTRATO</b>
                </Typography> 
            </AccordionSummary>
            <AccordionDetails>
                <Paper elevation={1} style={{ padding: 16 }}>
                    <div>
                        {nativeParamsClauses}
                        {featuresClauses}
                    </div>
                </Paper>
            </AccordionDetails>
        </Accordion>
    </div>
}

export default ContractTextPanel;