import { Accordion, AccordionDetails, AccordionSummary, Typography, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function CurrencySelect({ currency, setCurrency }) {

    function handleChange(e) {
        setCurrency(Number(e.target.value))
    }

    return <div>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Moeda do contrato</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Selecione a moeda digital que será utilizada para as transações financeiras deste contrato
                </Typography>
                <p/>
                <Select
                    label="Currency"
                    size="small"
                    onChange={handleChange} 
                    value={currency}
                >
                    <MenuItem key={1} value={1}>{"Ether (ETH)"}</MenuItem>
                    <MenuItem key={2} value={2}>{"USDT"}</MenuItem>
                </Select>
            </AccordionDetails>
        </Accordion>
    </div>
}

export default CurrencySelect;