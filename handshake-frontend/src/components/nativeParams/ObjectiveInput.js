


function ObjectiveInput ({ state, setState }) {

    const handleChange = (event) => {
        setState("objective_", event.target.value);
    }

    return <div>
        <p>
            Especifique o objetivo do contrato: <input value={state} onChange={handleChange} />
        </p>
    </div>

}

export default ObjectiveInput;