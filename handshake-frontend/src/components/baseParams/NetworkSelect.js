import { Accordion, AccordionDetails, AccordionSummary, Typography, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Redux Stuff
import { useDispatch, useSelector } from 'react-redux';
import { changeNetwork } from '../../store';

function NetworkSelect() {

    const dispatch = useDispatch();
    const network = useSelector((state) => {
        return state.network.network;
    });
    
    const handleChange = (e) => {
        dispatch(changeNetwork(e.target.value));
    }

    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Rede Blockchain</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Selecione a rede blockchain na qual o contrato será executado
                </Typography>
                <p/>
                <Select
                    label="Network"
                    size="small"
                    onChange={handleChange} 
                    value={network}
                >
                    <MenuItem key={1} value={1}>Ethereum</MenuItem>
                    <MenuItem key={2} value={2}>Polygon</MenuItem>
                </Select>
            </AccordionDetails>
        </Accordion>
    </div>
}

export default NetworkSelect;