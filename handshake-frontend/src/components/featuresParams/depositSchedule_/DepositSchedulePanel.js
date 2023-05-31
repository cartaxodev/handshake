import { useState } from "react";
import DepositSchedulingForm from "./DepositSchedulingForm";
import { useDispatch, useSelector } from "react-redux";
import { createDepositSchedule } from "../../../store";

function DepositSchedulePanel () {

    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.depositSchedule.depositSchedule_;
    });

    const [numDeposits, setNumDeposits] = useState(0);

    const handleInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            setNumDeposits(value);
        }
    }

    const handleCreateScheduleClick = (e) => {
        dispatch(createDepositSchedule(numDeposits));
    }

    function calcTotal() {
        let sum = 0;
        for (let s of state) {
            sum = sum + s._value;
        }
        return sum;
    }
    
    let renderedScheduling = state.map((scheduling, index) => {

        return (
            <div key={index}>
                <DepositSchedulingForm index={index}
                                       scheduling={scheduling}
                                       />
            </div>
        );
    });

    return (
        <div>
            <div>
                Informe o número de depósitos que será realizado por cada membro:
                <input 
                    onChange={handleInputChange} 
                    value={numDeposits}
                    type="number"/>
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