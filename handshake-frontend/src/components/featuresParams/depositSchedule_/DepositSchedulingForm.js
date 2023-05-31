import { useDispatch } from "react-redux";
import { changeDepositScheduling } from "../../../store";

function DepositSchedulingForm ({ index, scheduling }) {

    const dispatch = useDispatch();

    const handleValueChange = (e) => {
        const value = Number(e.target.value);
        if(!isNaN(value)) {
            dispatch(changeDepositScheduling({
                index: index,
                scheduling: {
                    ...scheduling,
                    _value: value
                }
            }));
        }
    }

    const handleDeadlineChange = (e) => {
        const deadline = Number(e.target.value);
        if(!isNaN(deadline)) {
            dispatch(changeDepositScheduling({
                index: index,
                scheduling: {
                    ...scheduling,
                    _deadlineTimestamp: deadline
                }
            }));
        }
    }

    return (
        <div>
            <div>
                <p/>
                Depósito #{index + 1}:
            </div>
            <div>
                Valor: <input onChange={handleValueChange} value={scheduling._value}/>
            </div>
            <div>
                Deadline: <input onChange={handleDeadlineChange} value={scheduling._deadlineTimestamp}/>
            </div>
        </div>
    );
}

export default DepositSchedulingForm;