function CurrencySelect({ currency, setCurrency }) {

    function handleChange(e) {
        setCurrency(Number(e.target.value))
    }

    return (
        <div>
            <div>
                Selecione a moeda digital que será utilizada para as transações financeiras deste contrato:
            </div>
            <div>
                <select onChange={handleChange} value={currency}>
                <option key={1} value={1}>{"Ether (ETH)"}</option>
                <option key={2} value={2}>{"USDT"}</option>
                </select>
            </div>
        </div>
    );
}

export default CurrencySelect;