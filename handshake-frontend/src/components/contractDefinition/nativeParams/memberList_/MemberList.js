import MemberForm from "./MemberForm";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../../../../store";

//MUI
import { Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function MemberList () {

    const dispatch = useDispatch();
    const memberList = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const handleAddMemberClick = (e) => {

        dispatch(addMember({
                _login: "",
                _mainAddress: "",
                _secondaryAddresses: []
            }));
    }

    let memberInputs = memberList.map((member, index) => {
        return (
        <div key={index}>
            <MemberForm 
                memberId={member._id} />
        </div>
        );
    });

    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Membros:</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Informe abaixo os dados de cada membro participante do contrato:
                </Typography>
                {memberInputs}
                <p>
                    <Button 
                        size="small"
                        variant="outlined"
                        onClick={handleAddMemberClick}>Adicionar Membro</Button>
                </p>
            </AccordionDetails>
        </Accordion>
    </div>

}

export default MemberList;