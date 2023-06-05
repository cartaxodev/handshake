import { useDispatch, useSelector } from "react-redux";
import { changeMaxWithdrawValue } from "../../../../store";

//MUI
import { Typography, Input } from "@mui/material";

function MaxWithdrawValueInput () {

    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.maxWithdrawValue.maxWithdrawValue_;
    })

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            dispatch(changeMaxWithdrawValue(value));
        }
    }

    return (
        <div>
            <Typography>
                Qual o valor máximo de cada saque de valores do contrato?
            </Typography>
            <p/>
            <Input
                variant='outlined'
                size="small"
                label="max_value"
                defaultValue="Default Value"
                value={state} 
                onChange={handleChange} 
                type="number"
            />
        </div>
    );
}

export default MaxWithdrawValueInput;