import getContractTypes from './api';
import { useState } from 'react';
import ContractTypesSelect from './ContractTypesSelect';
import NetworkSelect from './NetworkSelect';
import CurrencySelect from './CurrencySelect';

function App() {

    const [baseParams, setBaseParams] = useState(undefined)
    const [contractTypes, setContractTypes] = useState(undefined)

    const handleClick = async () => {
        const getContractTypesResponse = await getContractTypes();
        setBaseParams(getContractTypesResponse.data.baseParams);
        setContractTypes(getContractTypesResponse.data.contractTypes);
    }

    return (
    <div>
        <div>
            <button onClick={handleClick}>
                Elaborar Novo Contrato
            </button>
        </div>
        {renderBaseParamsComponents(baseParams)}
        {renderContractTypesSelect(contractTypes)}
    </div>
    );
}

function renderBaseParamsComponents(baseParams_) {
    
    if (baseParams_ === undefined) {
        return <div></div>

    } else {


        const renderedComponents = baseParams_.map((param) => {

            if (param.fieldName === "network") {
                return <NetworkSelect networks={param.options}/>
            }
            if (param.fieldName === "currency") {
                return <CurrencySelect currencies={param.options} />
            }

        });

        return (
            <div>
                {renderedComponents}
            </div>
        );


        // return (
        //     <div>
        //         <ContractTypesSelect contractTypes={contractTypes_}/>
        //     </div>
        // );
    }
}

function renderContractTypesSelect(contractTypes_) {
    if (contractTypes_ === undefined) {
        return <div></div>
    } else {
        return (
            <div>
                <ContractTypesSelect contractTypes={contractTypes_}/>
            </div>
        );
    }
}

export default App;