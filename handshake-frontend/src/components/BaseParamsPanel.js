import NetworkSelect from "./baseParams/NetworkSelect";
import CurrencySelect from "./baseParams/CurrencySelect";
import ContractTypesSelect from "./baseParams/ContractTypesSelect";

function BaseParamsPanel({contractTypes,
                        network,
                        currency,
                        setContractType, 
                        setNetwork, 
                        setCurrency,
                        handleDefineClausesButtonClick}) {
    
    
    
    if (contractTypes === undefined) {
        return <div></div>
        
    } else {
        return (
            <div>
                <div>
                    <NetworkSelect network={network} setNetwork={setNetwork} />
                    <CurrencySelect currency={currency} setCurrency={setCurrency} />
                </div>
                <div>
                    <ContractTypesSelect contractTypes={contractTypes} setContractType={setContractType}/>
                </div>
                <div>
                    <button onClick={handleDefineClausesButtonClick}>Definir cláusulas</button>
                </div>
            </div>  
        );
    }
}

export default BaseParamsPanel;
