

function MinApprovalsToAddInput ({ state, setState }) {

    const handleChange = (e) => {
        const value =  Number(e.target.value);
        if (!isNaN(value)) {
            setState("minApprovalsToAddNewMember_", value);
        }
    }

    return (
        <div>
            <p>Quantas aprovações de membros da comissão são necessárias para aprovar a inclusão de um novo membro?</p>
            <input value={state} onChange={handleChange} />
        </div>
    );
}

export default MinApprovalsToAddInput;