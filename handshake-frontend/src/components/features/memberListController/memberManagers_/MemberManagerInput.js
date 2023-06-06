import { useDispatch } from "react-redux";
import { addMemberManager, removeMemberManager } from "../../../../store";

//MUI
import { Checkbox, FormControlLabel } from "@mui/material";

function MemberManagerInput ({ member, isManager }) {

    const dispatch = useDispatch();

    const handleCheckboxChange = (e) => {

        if (isManager === false) {
            dispatch(addMemberManager(Number(e.target.value)));
        }
        else {
            dispatch(removeMemberManager(Number(e.target.value)));
        }
    }

    return (
        <div>
            <FormControlLabel label={member._login} control={
                <Checkbox
                    onChange={handleCheckboxChange}
                    value={member._id}
                    checked={isManager}>
            </Checkbox>
            } />
        </div>
    );
}

export default MemberManagerInput;