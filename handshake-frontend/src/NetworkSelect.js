import { useState } from "react";


function NetworkSelect({ networks }) {

    const renderedOptions = networks.map((network) => {
        return <option key={network.id}>{network.networkName}</option>
    });

    return (
        <div>
            <div>
                Selecione a rede blockchain onde será feito o deploy do contrato:
            </div>
            <div>
                <select>
                    {renderedOptions}
                </select>
            </div>
        </div>
    );
}

export default NetworkSelect;