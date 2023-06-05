import { useDispatch } from "react-redux";
import { addWithdrawalApprover, removeWithdrawalApprover } from "../../../../store";

//MUI
import { FormControlLabel, Checkbox } from "@mui/material";

function WithdrawalApproverInput ({ member, isApprover }) {

    const dispatch = useDispatch();

    const handleCheckboxChange = (e) => {

        if (isApprover === false) {
            dispatch(addWithdrawalApprover(Number(e.target.value)));
        }
        else {
            dispatch(removeWithdrawalApprover(Number(e.target.value)));
        }
    }

    return (
        <div>
            <FormControlLabel label={member._login} control={
                <Checkbox
                    onChange={handleCheckboxChange}
                    value={member._id}
                    checked={isApprover}>
            </Checkbox>
            } />
        </div>
    );
}

export default WithdrawalApproverInput;