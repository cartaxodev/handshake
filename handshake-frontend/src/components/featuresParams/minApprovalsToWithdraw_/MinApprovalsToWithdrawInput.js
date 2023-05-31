import { useDispatch, useSelector } from "react-redux";
import { changeMinApprovalsToWithdraw } from "../../../store";

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
            <p>Quantas aprovações de membros da comissão são necessárias para aprovar um saque de valores do contrato?</p>
            <input 
                value={state} 
                onChange={handleChange} 
                type="number"/>
        </div>
    );
}

export default MinApprovalsToWithdrawInput;