function NetworkSelect({ setNetwork }) {
    
    function handleChange(event) {
        setNetwork(Number(event.target.value));
    }

    return (
        <div>
            <div>
                Selecione a rede blockchain onde será feito o deploy do contrato:
            </div>
            <div>
                <select onChange={handleChange}>
                    <option key={1} value={1}>Ethereum</option>
                    <option key={2} value={2}>Polygon</option>
                </select>
            </div>
        </div>
    );
}

export default NetworkSelect;