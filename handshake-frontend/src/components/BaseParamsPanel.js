import NetworkSelect from "./baseParams/NetworkSelect";
import CurrencySelect from "./baseParams/CurrencySelect";
import ContractTypesSelect from "./baseParams/ContractTypesSelect";
import { Button}  from "@mui/material";

function BaseParamsPanel({contractTypes,  
                        handleDefineClausesButtonClick}) {
    
    if (contractTypes === undefined) {
        return <div></div>
        
    } else {
        return (
            <div>
                <div>
                    <NetworkSelect />
                    <CurrencySelect />
                </div>
                <div>
                    <ContractTypesSelect contractTypes={contractTypes} />
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
