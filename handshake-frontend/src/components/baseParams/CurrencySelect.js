import { Accordion, AccordionDetails, AccordionSummary, Typography, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Redux Stuff:
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrency } from '../../store';

function CurrencySelect() {

    const dispatch = useDispatch();
    const currency = useSelector((state) => {
        return state.currency.currency;
    });

    function handleChange(e) {
        dispatch(changeCurrency(e.target.value));
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