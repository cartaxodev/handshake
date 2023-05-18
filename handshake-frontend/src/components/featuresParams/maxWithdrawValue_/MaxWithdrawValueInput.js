

function MaxWithdrawValueInput ({ state, setState }) {

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            setState("maxWithdrawValue_", value);
        }
    }

    return (
        <div>
            <p>Qual o valor máximo de cada saque de valores do contrato?</p>
            <input value={state} onChange={handleChange} />
        </div>
    );
}

export default MaxWithdrawValueInput;