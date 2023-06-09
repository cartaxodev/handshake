import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeDeadlineControlConfig } from '../../../../../store';
import { Typography, FormControlLabel, Checkbox, Input } from '@mui/material';

function DeadlineControlConfigForm () {

    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.deadlineControlConfig.deadlineControlConfig_;
    });

    const [dailyFeeEnabled, setDailyFeeEnabled] = useState(false);
    const [weeklyFeeEnabled, setWeeklyFeeEnabled] = useState(false);
    const [monthlyFeeEnabled, setMonthlyFeeEnabled] = useState(false);

    const handleDailyInputChange = (e) => {

        const controlActive = dailyFeeEnabled || weeklyFeeEnabled || monthlyFeeEnabled;
        const value = Number(e.target.value);

        if (!isNaN(value)) {
            dispatch(changeDeadlineControlConfig({
                ...state,
                _isControlActive: controlActive,
                _dailyFee: value
            }));
        }
    }

    const handleWeeklyInputChange = (e) => {

        const controlActive = dailyFeeEnabled || weeklyFeeEnabled || monthlyFeeEnabled;
        const value = Number(e.target.value);

        if (!isNaN(value)) {
            dispatch(changeDeadlineControlConfig({
                ...state,
                _isControlActive: controlActive,
                _weeklyFee: value
            }));
        }
    }

    const handleMonthlyInputChange = (e) => {

        const controlActive = dailyFeeEnabled || weeklyFeeEnabled || monthlyFeeEnabled;
        const value = Number(e.target.value);

        if (!isNaN(value)) {
            dispatch(changeDeadlineControlConfig({
                ...state,
                _isControlActive: controlActive,
                _monthlyFee: value
            }));
        }
    }


    const handleDailyCheckboxChange = (e) => {
        setDailyFeeEnabled(e.target.checked);
        if (e.target.checked === false) {
            e.target.value = 0;
            handleDailyInputChange(e);
        }
    }

    const handleWeeklyCheckboxChange = (e) => {
        setWeeklyFeeEnabled(e.target.checked);
        if (e.target.checked === false) {
            e.target.value = 0;
            handleWeeklyInputChange(e);
        }
    }

    const handleMonthlyCheckboxChange = (e) => {
        setMonthlyFeeEnabled(e.target.checked);
        if (e.target.checked === false) {
            e.target.value = 0;
            handleMonthlyInputChange(e);
        }
    }

    return (
        <div>
            <Typography>
                Informe qual deve ser a taxa por atraso nos depósitos (se houver):
            </Typography>

            <div>
                <FormControlLabel label={"Daily Fee (%): "} control={
                    <Checkbox
                        onChange={handleDailyCheckboxChange}
                        checked={dailyFeeEnabled}>
                    </Checkbox>
                } />
                <Input
                    variant='outlined'
                    size="small"
                    defaultValue={0}
                    value={state._dailyFee} 
                    onChange={handleDailyInputChange}
                    disabled={!dailyFeeEnabled}
                    type="number"
                />
            </div>
            <div>
                <FormControlLabel label={"Weekly Fee (%): "} control={
                    <Checkbox
                        onChange={handleWeeklyCheckboxChange}
                        checked={weeklyFeeEnabled}>
                    </Checkbox>
                } />
                <Input
                    variant='outlined'
                    size="small"
                    defaultValue={0}
                    value={state._weeklyFee} 
                    onChange={handleWeeklyInputChange}
                    disabled={!weeklyFeeEnabled}
                    type="number"
                />
            </div>
            <div>
                <FormControlLabel label={"Monthly Fee (%): "} control={
                    <Checkbox
                        onChange={handleMonthlyCheckboxChange}
                        checked={monthlyFeeEnabled}>
                    </Checkbox>
                } />
                <Input
                    variant='outlined'
                    size="small"
                    defaultValue={0}
                    value={state._monthlyFee} 
                    onChange={handleMonthlyInputChange}
                    disabled={!monthlyFeeEnabled}
                    type="number"
                />
            </div>
        </div>
    );

}

export default DeadlineControlConfigForm;