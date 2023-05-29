import api from './api';
import { useState } from 'react';
import BaseParamsPanel from './components/BaseParamsPanel';
import ContractDefinitionPanel from './components/ContractDefinitionPanel';

function App() {

    //State for contractTypes fetched from the API
    const [contractTypes, setContractTypes] = useState(undefined);

    //States for basic params
    const [currency, setCurrency] = useState(1);
    const [network, setNetwork] = useState(1);
    const [contractType, setContractType] = useState(1);

    //States for contractTemplate fecthed from the API
    const [contractTemplate, setContractTemplate] = useState(undefined);

    //Array of states for each contract template field.
    //This array is used to provide state to each component of contract definition
    const [contractDefinitionState, setContractDefinitionState] = useState([]);

    const handleNewContractButtonClick = async () => {
        const apiResponse = await api.getContractTypes();
        setContractTypes(apiResponse);
    }

    const handleDefineClausesButtonClick = async () => {
        const apiResponse = await api.getContractTemplate(network,
                                                        currency,
                                                        contractType);
        setContractTemplate(apiResponse);
        buildContractDefinitionStates(apiResponse);
    }

    const buildContractDefinitionStates = async (apiResponse) => {

        const contractStates = [];

        let param;
        for (param of apiResponse.nativeParams) {
            contractStates.push({
                name: param.name,
                stateValue: param.defaultValue
            });
        }

        for (param of apiResponse.featuresParams) {
            contractStates.push({
                name: param.name,
                stateValue:  param.defaultValue
            });
        }

        setContractDefinitionState(contractStates);
    }

    return (
        <div>
            <div>
                <button onClick={handleNewContractButtonClick}>
                    Elaborar Novo Contrato
                </button>
            </div>
            <div>
                <BaseParamsPanel contractTypes={contractTypes}
                                network={network}
                                currency={currency}
                                setContractType={setContractType}
                                setNetwork={setNetwork}
                                setCurrency={setCurrency}
                                handleDefineClausesButtonClick={handleDefineClausesButtonClick} />
            </div>
            {/* <div>
                <p>Contract Template:</p>
                {JSON.stringify(contractTemplate)}
            </div> */}
            <div>
                <ContractDefinitionPanel contractDefinitionState={contractDefinitionState}
                                            setContractDefinitionState={setContractDefinitionState}/>
            </div>
            <div>
                <p>
                    {JSON.stringify(contractDefinitionState)}
                </p>
            </div>
        </div>
    );
}

export default App;