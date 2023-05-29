


function ObjectiveInput ({ state, setState }) {

    const handleChange = (e) => {
        setState("objective_", e.target.value);
    }

    return <div>
        <p>
            Especifique o objetivo do contrato: <input value={state} onChange={handleChange} />
        </p>
    </div>

}

export default ObjectiveInput;