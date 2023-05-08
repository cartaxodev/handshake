import { useState } from "react";


function ContractTypesSelect({ contractTypes }) {

    const [contractDescription, setcontractDescription] = useState(contractTypes[0].description)

    function handleChange(event) {
        const contractId = Number(event.target.value);
        let contractType;

        for (contractType of contractTypes) {
            if (contractId === contractType.id) {
                setcontractDescription(contractType.description);
                break;
            }
        }
    }

    const renderedOptions = contractTypes.map((contractType) => {
        return <option key={contractType.id} value={contractType.id}>{contractType.name}</option>
    });

    return (
        <div>
            <div>
                Selecione o tipo de contrato que deseja gerar:
            </div>
            <div>
                <select onChange={handleChange}>
                    {renderedOptions}
                </select>
            </div>
            <div>
                Descrição do contrato: {contractDescription}
            </div>
        </div>
    );
}

export default ContractTypesSelect;