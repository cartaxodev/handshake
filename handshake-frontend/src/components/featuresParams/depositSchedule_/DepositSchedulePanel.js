import { useState } from "react";
import DepositSchedulingForm from "./DepositSchedulingForm";


function DepositSchedulePanel ({ state, setState }) {

    const [numDeposits, setNumDeposits] = useState(0);

    const handleInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            setNumDeposits(value);
        }
    }

    const handleCreateScheduleClick = (e) => {
        let schedulings = [];
        for (let i = 0; i < numDeposits; i++) {
            schedulings.push({
                _value: 0,
                _deadlineTimestamp: 0,
                _executionInfo: {}
            });
        }
        setState("depositSchedule_", schedulings);
    }

    const setDepositSchedulingState = (index, newState) => {
        let schedulings = [];
        for (let i = 0; i < state.length; i++) {
            if (i === index) {
                schedulings.push(newState);
            }
            else {
                schedulings.push(state[i]);
            }
        }
        setState("depositSchedule_", schedulings);
    }

    function calcTotal() {
        let sum = 0;
        for (let s of state) {
            sum = sum + s._value;
        }
        return sum;
    }
    
    let renderedScheduling = state.map((el, index) => {

        return (
            <div key={index}>
                <DepositSchedulingForm index={index}
                                       state={state[index]}
                                       setState={setDepositSchedulingState} />
            </div>
        );
    });

    return (
        <div>
            <div>
                Informe o número de depósitos que será realizado por cada membro:
                <input onChange={handleInputChange} value={numDeposits}/>
            </div>
            <div>
                <button onClick={handleCreateScheduleClick}>Criar Calendário de Depósitos</button>
            </div>
            <div>
                <p/>
                {renderedScheduling}
            </div>
            <div>
                Valor total a ser depositado por cada membro: {calcTotal()}
            </div>
        </div>
    );
}

export default DepositSchedulePanel;