import { useState } from "react";
import DepositSchedulingForm from "./DepositSchedulingForm";
import { useDispatch, useSelector } from "react-redux";
import { createDepositSchedule } from "../../../../../store";
import { Typography, Input, Button } from "@mui/material";

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
                <Typography>
                    Informe o número de depósitos que será realizado por cada membro:
                </Typography>
                <Input
                    variant='outlined'
                    size="small"
                    defaultValue={0}
                    value={numDeposits} 
                    onChange={handleInputChange} 
                    type="number"
                />
            </div>
            <div>
                {/* <button onClick={handleCreateScheduleClick}>Criar Calendário de Depósitos</button> */}
                <Button 
                        size="small"
                        variant="outlined"
                        onClick={handleCreateScheduleClick}>Criar Calendário de Depósitos</Button>
            </div>
            <div>
                <p/>
                {renderedScheduling}
            </div>
            <div>
                <p/>
                <Typography>
                    Valor total a ser depositado por cada membro: {calcTotal()}
                </Typography>
            </div>
        </div>
    );
}

export default DepositSchedulePanel;