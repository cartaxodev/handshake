import NetworkSelect from "./baseParams/NetworkSelect";
import CurrencySelect from "./baseParams/CurrencySelect";
import ContractTypesSelect from "./baseParams/ContractTypesSelect";
import { Button}  from "@mui/material";

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
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleDefineClausesButtonClick}>Definir cláusulas</Button>
                </div>
            </div>  
        );
    }
}

export default BaseParamsPanel;
