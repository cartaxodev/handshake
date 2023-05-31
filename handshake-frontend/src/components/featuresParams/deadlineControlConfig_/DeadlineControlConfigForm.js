import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeDeadlineControlConfig } from '../../../store';

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
        <p/>
            <div>
                Informe qual deve ser a taxa por atraso nos depósitos (se houver):
            </div>
            <div>
                <input type="checkbox" onChange={handleDailyCheckboxChange} />
                Daily Fee (%): <input value={state._dailyFee} 
                                      disabled={!dailyFeeEnabled} 
                                      onChange={handleDailyInputChange}/>
            </div>
            <div>
                <input type="checkbox" onChange={handleWeeklyCheckboxChange} />
                Weekly Fee (%): <input value={state._weeklyFee} 
                                       disabled={!weeklyFeeEnabled}
                                       onChange={handleWeeklyInputChange} />
            </div>
            <div>
                <input type="checkbox" onChange={handleMonthlyCheckboxChange} />
                Monthly Fee (%): <input value={state._monthlyFee} 
                                        disabled={!monthlyFeeEnabled} 
                                        onChange={handleMonthlyInputChange}/>
            </div>
    </div>
    );

}

export default DeadlineControlConfigForm;