import { useDispatch } from "react-redux";
import { changeDepositScheduling } from "../../../../store";

//MUI
import { Card, Typography, Input } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

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
        const deadline = e.target.value;
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
                    <Typography>
                        Valor:
                    </Typography>
                    <Input
                        variant='outlined'
                        size="small"
                        label="Value"
                        value={scheduling._value} 
                        onChange={handleValueChange} 
                        type="number"
                    />
                </div>
                <div>
                    <Typography>
                        Deadline:
                    </Typography>

                    <Typography color="red">
                        INCLUIR AQUI UM COMPONENTE DE DATA QUE FUNCIONE
                    </Typography>
                    

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                            <DateTimeField label="Basic date time field"
                                //value={scheduling._deadlineTimestamp} 
                                onChange={handleDeadlineChange}  />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </Card>
        </div>    
    );
}

export default DepositSchedulingForm;