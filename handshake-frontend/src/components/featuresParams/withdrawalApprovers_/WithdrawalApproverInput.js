import { useDispatch } from "react-redux";
import { addWithdrawalApprover, removeWithdrawalApprover } from "../../../store";

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
            {member._login}: 
            <input type="checkbox" 
                   onChange={handleCheckboxChange}
                   value={member._id}
                   checked={isApprover}>
            </input>
        </div>
    );
}

export default WithdrawalApproverInput;