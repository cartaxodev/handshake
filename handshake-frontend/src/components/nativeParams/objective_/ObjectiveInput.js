import { useDispatch, useSelector } from 'react-redux';
import { changeObjective } from '../../../store';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function ObjectiveInput () {

    const dispatch = useDispatch();
    const objective = useSelector((state) => {
        return state.objective.objective_;
    });

    const handleChange = (e) => {
        dispatch(changeObjective(e.target.value));
    }

    return <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Objetivo:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                            Especifique o objetivo do contrato, informando em detalhes sobre o seu propósito
                    </Typography>
                    <p/>
                    <TextField
                        variant='outlined'
                        fullWidth
                        size="small"
                        label="Objetivo"
                        multiline
                        rows={4}
                        defaultValue="Default Value"
                        value={objective} 
                        onChange={handleChange} 
                    />
                </AccordionDetails>
            </Accordion>
        </div>

}

export default ObjectiveInput;