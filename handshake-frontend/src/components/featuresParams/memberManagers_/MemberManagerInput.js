import { useDispatch } from "react-redux";
import { addMemberManager, removeMemberManager } from "../../../store";

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
            {member._login}: 
            <input type="checkbox" 
                   onChange={handleCheckboxChange}
                   value={member._id}
                   checked={isManager}>
            </input>
        </div>
    );
}

export default MemberManagerInput;