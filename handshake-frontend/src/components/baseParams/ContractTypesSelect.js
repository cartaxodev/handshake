import { useState } from "react";


function ContractTypesSelect({ contractTypes, setContractType }) {

    const [contractDescription, setContractDescription] = useState(contractTypes[0].description)

    function handleChange(e) {
        const contractId = Number(e.target.value);
        let contractType;

        for (contractType of contractTypes) {
            if (contractId === contractType.id) {
                setContractDescription(contractType.description);
                break;
            }
        }

        setContractType(contractId);
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