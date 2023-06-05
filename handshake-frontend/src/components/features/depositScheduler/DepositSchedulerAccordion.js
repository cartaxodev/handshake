import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeadlineControlConfigForm from './deadlineControlConfig_/DeadlineControlConfigForm';
import DepositSchedulePanel from './depositSchedule_/DepositSchedulePanel';

function DepositSchedulerAccordion() {

    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Regras de depósitos:</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <DepositSchedulePanel />
                <p/>
                <DeadlineControlConfigForm />
            </AccordionDetails>
        </Accordion>
    </div>
}

export default DepositSchedulerAccordion;