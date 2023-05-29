

function MinApprovalsToWithdrawInput ({ state, setState }) {

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            setState("minApprovalsToWithdraw_", value);
        }
    }

    return (
        <div>
            <p>Quantas aprovações de membros da comissão são necessárias para aprovar um saque de valores do contrato?</p>
            <input value={state} onChange={handleChange} />
        </div>
    );
}

export default MinApprovalsToWithdrawInput;