import { useDispatch, useSelector } from "react-redux";
import { changeMinApprovalsToAddNewMember } from "../../../../store";

//MUI
import { Typography, Input } from "@mui/material";

function MinApprovalsToAddInput () {

    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.minApprovalsToAddNewMember.minApprovalsToAddNewMember_;
    });

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            dispatch(changeMinApprovalsToAddNewMember(value));
        }
    }

    return <div>
        <Typography>
            Quantas aprovações de membros da comissão são necessárias para aprovar a inclusão de um novo membro?
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
}

export default MinApprovalsToAddInput;