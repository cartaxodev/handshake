import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MemberManagerList from './memberManagers_/MemberManagerList';
import MinApprovalsToAddInput from './minApprovalsToAddNewMember_/MinApprovalsToAddInput';
import MinApprovalsToRemoveInput from './minApprovalsToRemoveMember.js/MinApprovalsToRemoveInput';

function MemberListControllerAccordion() {

    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Administração de Membros:</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <MemberManagerList />
                <MinApprovalsToAddInput />
                <MinApprovalsToRemoveInput />
            </AccordionDetails>
        </Accordion>
</div>

}


export default MemberListControllerAccordion;