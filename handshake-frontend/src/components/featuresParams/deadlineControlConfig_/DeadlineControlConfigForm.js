import { useState } from 'react';

function DeadlineControlConfigForm ({ state, setState }) {

    const [dailyFeeEnabled, setDailyFeeEnabled] = useState(false);
    const [weeklyFeeEnabled, setWeeklyFeeEnabled] = useState(false);
    const [monthlyFeeEnabled, setMonthlyFeeEnabled] = useState(false);

    const handleDailyInputChange = (e) => {

        const controlActive = dailyFeeEnabled || weeklyFeeEnabled || monthlyFeeEnabled;
        const value = Number(e.target.value);

        if (!isNaN(value)) {
            setState("deadlineControlConfig_", {
                _isControlActive: controlActive,
                _dailyFee: value,
                _weeklyFee: state._weeklyFee,
                _monthlyFee: state._monthlyFee
            });
        }
    }

    const handleWeeklyInputChange = (e) => {

        const controlActive = dailyFeeEnabled || weeklyFeeEnabled || monthlyFeeEnabled;
        const value = Number(e.target.value);

        if (!isNaN(value)) {
            setState("deadlineControlConfig_", {
                _isControlActive: controlActive,
                _dailyFee: state._dailyFee,
                _weeklyFee: value,
                _monthlyFee: state._monthlyFee
            });
        }
    }

    const handleMonthlyInputChange = (e) => {

        const controlActive = dailyFeeEnabled || weeklyFeeEnabled || monthlyFeeEnabled;
        const value = Number(e.target.value);

        if (!isNaN(value)) {
            setState("deadlineControlConfig_", {
                _isControlActive: controlActive,
                _dailyFee: state._dailyFee,
                _weeklyFee: state._weeklyFee,
                _monthlyFee: value
            });
        }
    }


    const handleDailyCheckboxChange = (e) => {
        setDailyFeeEnabled(e.target.checked);
    }

    const handleWeeklyCheckboxChange = (e) => {
        setWeeklyFeeEnabled(e.target.checked);
    }

    const handleMonthlyCheckboxChange = (e) => {
        setMonthlyFeeEnabled(e.target.checked);
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