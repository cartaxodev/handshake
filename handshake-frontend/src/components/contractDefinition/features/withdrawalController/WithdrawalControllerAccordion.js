import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WithdrawalApproversList from './withdrawalApprovers_/WithdrawalApproversList'
import MinApprovalsToWithdrawInput from './minApprovalsToWithdraw_/MinApprovalsToWithdrawInput';
import MaxWithdrawValueInput from './maxWithdrawValue_/MaxWithdrawValueInput';

function WithdrawalControllerAccordion() {

    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Regras de saques (retiradas):</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <WithdrawalApproversList />
                <p/>
                <MinApprovalsToWithdrawInput />
                <p/>
                <MaxWithdrawValueInput />
            </AccordionDetails>
        </Accordion>
    </div>
}

export default WithdrawalControllerAccordion;