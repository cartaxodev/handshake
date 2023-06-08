
//Redux stuff:
import { useDispatch, useSelector } from 'react-redux';
import { changeObjective } from '../../../store';

//MUI
import { TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'


function ObjectiveInput ({ objectiveFields, defaultObjective }) {

    const dispatch = useDispatch();
    const objective = useSelector((state) => {
        return state.objective.objective_;
    });

    const handleChange = (e) => {
        dispatch(changeObjective(e.target.value));
    }

    const variableFields = objectiveFields.map((field, index) => {
        return <div>
                <p/>
                <TextField
                    variant='outlined'
                    fullWidth
                    size="small"
                    label={field}
                    //value={objective} 
                    //onChange={handleChange} 
                />
            </div>
    })

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
                        value={objective} 
                        onChange={handleChange}
                        disabled={!!defaultObjective}
                    />
                    <p/>
                    <Typography>
                        Informe abaixo informações adicionais sobre o objetivo do contrato:
                    </Typography>
                    {variableFields}
                </AccordionDetails>
            </Accordion>
        </div>

}

export default ObjectiveInput;