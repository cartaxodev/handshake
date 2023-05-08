import { useState } from "react";


function CurrencySelect({ currencies }) {

    const renderedOptions = currencies.map((currency) => {
        return <option key={currency.id}>{currency.currencyName}</option>
    });

    return (
        <div>
            <div>
                Selecione a moeda digital que será utilizada para as transações financeiras deste contrato:
            </div>
            <div>
                <select>
                    {renderedOptions}
                </select>
            </div>
        </div>
    );
}

export default CurrencySelect;