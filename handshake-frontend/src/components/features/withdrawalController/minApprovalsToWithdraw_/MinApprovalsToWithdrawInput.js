import { useDispatch, useSelector } from "react-redux";
import { changeMinApprovalsToWithdraw } from "../../../../store";

//MUI
import { Typography, Input } from "@mui/material";

function MinApprovalsToWithdrawInput () {

    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.minApprovalsToWithdraw.minApprovalsToWithdraw_;
    });

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            dispatch(changeMinApprovalsToWithdraw(value)); 
        }
    }

    return (
        <div>
            <Typography>
                Quantas aprovações de membros da comissão são necessárias para aprovar um saque de valores do contrato?
            </Typography>
            <p/>
            <Input
                variant='outlined'
                size="small"
                label="min_approvals"
                defaultValue="Default Value"
                value={state} 
                onChange={handleChange} 
                type="number"
            />
        </div>
    );
}

export default MinApprovalsToWithdrawInput;