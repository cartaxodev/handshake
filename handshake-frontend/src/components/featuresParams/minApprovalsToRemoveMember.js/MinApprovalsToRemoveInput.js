import { useDispatch, useSelector } from "react-redux";
import { changeMinApprovalsToRemoveMember } from "../../../store";

function MinApprovalsToRemoveInput () {

    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.minApprovalsToRemoveMember.minApprovalsToRemoveMember_;
    });

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            dispatch(changeMinApprovalsToRemoveMember(value));
        }
    }

    return (
        <div>
            <p>Quantas aprovações de membros da comissão são necessárias para aprovar a remoção de um membro do contrato?</p>
            <input 
                value={state} 
                onChange={handleChange} 
                type="number"/>
        </div>
    );
}

export default MinApprovalsToRemoveInput;