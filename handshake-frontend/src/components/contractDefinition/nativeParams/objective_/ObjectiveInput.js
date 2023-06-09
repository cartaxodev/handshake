import { useState } from 'react';

//Redux stuff:
import { useDispatch, useSelector } from 'react-redux';
import { changeObjective } from '../../../../store';

//MUI
import { TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ObjectiveSubField from './ObjectiveSubField';


function ObjectiveInput ({ objectiveSubFields, defaultObjective }) {

    const dispatch = useDispatch();
    const objective = useSelector((state) => {
        return state.objective.objective_;
    });

    if (!objectiveSubFields) {objectiveSubFields = {}};
    const [subFieldsStates, setSubFieldsStates] = useState(objectiveSubFields.map(() => ""));

    const handleChange = (e) => {
        dispatch(changeObjective(e.target.value));
    }

    const handleSubFieldChange = (fieldIndex, fieldName, fieldValue) => {

        let newSubFieldStates = [];
        for (let i = 0; i < objectiveSubFields.length; i++) {
            if (i === fieldIndex) {
                newSubFieldStates.push(`${fieldName}: ${fieldValue}`);
            } else {
                newSubFieldStates.push(subFieldsStates[i]);
            }
        }

        setSubFieldsStates(newSubFieldStates);

        let newObjective = `${defaultObjective}, considerando os seguintes detalhes:`
        for (let subField of newSubFieldStates) {
            newObjective = 
                `${newObjective}\n${subField}`;
        }

        dispatch(changeObjective(newObjective));
    }

    const variableFields = objectiveSubFields.map((field, index) => {
        return <ObjectiveSubField 
                        index={index} 
                        fieldName={field} 
                        handleSubFieldChange={handleSubFieldChange}/>;
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
                        rows={6}
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