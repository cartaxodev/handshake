function CurrencySelect({ setCurrency }) {

    function handleChange(event) {
        setCurrency(Number(event.target.value))
    }

    return (
        <div>
            <div>
                Selecione a moeda digital que será utilizada para as transações financeiras deste contrato:
            </div>
            <div>
                <select onChange={handleChange}>
                <option key={1} value={1}>{"Ether (ETH)"}</option>
                <option key={2} value={2}>{"USDT"}</option>
                </select>
            </div>
        </div>
    );
}

export default CurrencySelect;