import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function ContractTypesSelect({ contractTypes, setContractType }) {

    const [contractDescription, setContractDescription] = useState(contractTypes[0].description)

    function handleChange(e) {
        const contractId = Number(e.target.value);
        let contractType;

        for (contractType of contractTypes) {
            if (contractId === contractType.id) {
                setContractDescription(contractType.description);
                break;
            }
        }

        setContractType(contractId);
    }

    const renderedOptions = contractTypes.map((contractType) => {
        return <MenuItem 
                key={contractType.id} 
                value={contractType.id}>{contractType.name}
            </MenuItem>
    });

 
    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Tipo de contrato</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Selecione o tipo de contrato que deseja elaborar
                </Typography>
                <p/>
                <Select
                    label="Type"
                    size="small"
                    onChange={handleChange} 
                >
                    {renderedOptions}
                </Select>
            </AccordionDetails>
        </Accordion>
    </div>
}

export default ContractTypesSelect;