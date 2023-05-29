

function DepositSchedulingForm ({ index, state, setState }) {

    const handleValueChange = (e) => {
        const value = Number(e.target.value);
        if(!isNaN(value)) {
            setState(index, {
                _value: value,
                _deadlineTimestamp: state._deadlineTimestamp,
                _executionInfo: {}
            });
        }
    }

    const handleDeadlineChange = (e) => {
        const deadline = Number(e.target.value);
        if(!isNaN(deadline)) {
            setState(index, {
                _value: state._value,
                _deadlineTimestamp: deadline,
                _executionInfo: {}
            });
        }
    }

    return (
        <div>
            <div>
                <p/>
                Depósito #{index + 1}:
            </div>
            <div>
                Valor: <input onChange={handleValueChange} value={state._value}/>
            </div>
            <div>
                Deadline: <input onChange={handleDeadlineChange} value={state._deadlineTimestamp}/>
            </div>
        </div>
    );
}

export default DepositSchedulingForm;