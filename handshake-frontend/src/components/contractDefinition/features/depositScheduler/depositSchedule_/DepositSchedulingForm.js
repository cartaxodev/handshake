import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { changeDepositScheduling } from "../../../../../store";

//MUI
import { Card, Typography, TextField } from '@mui/material'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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

    const handleDeadlineChange = (newValue) => {
        const deadline = newValue.unix();
        console.log(deadline);
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
            <Card spacing={1}>
                <div>
                    <Typography>
                        Depósito #{index + 1}:
                    </Typography>    
                </div>
                <div>
                    <p/>
                    <TextField
                        variant='outlined'
                        size="small"
                        label="Valor"
                        value={scheduling._value} 
                        onChange={handleValueChange} 
                        type="number"
                    />
                </div>
                <div>
                    <p/>
                    <DateTimePicker
                        label="Deadline"
                        value={dayjs.unix(scheduling._deadlineTimestamp)}
                        onChange={(newValue) => handleDeadlineChange(newValue)}
                    />
                    <p/>
                </div>
            </Card>
        </div>    
    );
}

export default DepositSchedulingForm;