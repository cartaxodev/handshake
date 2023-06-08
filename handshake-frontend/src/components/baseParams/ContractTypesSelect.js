
//MUI
import { Accordion, AccordionDetails, AccordionSummary, Typography, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Redux Stuff:
import { useDispatch, useSelector } from "react-redux";
import { changeContractType } from "../../store";

function ContractTypesSelect({ contractTypes }) {

    //const [contractDescription, setContractDescription] = useState(contractTypes[0].description)
    const dispatch = useDispatch();
    const contractType = useSelector((state) => {
        return state.contractType.contractType;
    });

    function handleChange(e) {
        dispatch(changeContractType(Number(e.target.value)));
    }

    const renderedOptions = contractTypes.map((contractType) => {
        return <MenuItem 
                key={contractType.id} 
                value={contractType.id}>{contractType.name}
            </MenuItem>
    });

    let contractDescription;
    for (let type of contractTypes) {
        if (type.id === contractType) {
            contractDescription = type.description;
            break;
        }
    }
 
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
                    value={contractType}
                >
                    {renderedOptions}
                </Select>
                <p/>
                <Typography>
                    {contractDescription}
                </Typography>
            </AccordionDetails>
        </Accordion>
    </div>
}

export default ContractTypesSelect;