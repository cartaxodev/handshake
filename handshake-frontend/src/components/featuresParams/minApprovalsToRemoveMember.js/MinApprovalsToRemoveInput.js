

function MinApprovalsToRemoveInput ({ state, setState }) {

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            setState("minApprovalsToRemoveMember_", value);
        }
    }

    return (
        <div>
            <p>Quantas aprovações de membros da comissão são necessárias para aprovar a remoção de um membro do contrato?</p>
            <input value={state} onChange={handleChange} />
        </div>
    );
}

export default MinApprovalsToRemoveInput;