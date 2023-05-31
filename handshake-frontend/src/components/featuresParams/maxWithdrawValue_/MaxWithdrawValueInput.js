import { useDispatch, useSelector } from "react-redux";
import { changeMaxWithdrawValue } from "../../../store";

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
            <p>Qual o valor máximo de cada saque de valores do contrato?</p>
            <input 
                value={state} 
                onChange={handleChange} />
        </div>
    );
}

export default MaxWithdrawValueInput;