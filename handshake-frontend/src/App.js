import React from 'react';
import api from './api';
import { useState } from 'react';
import BaseParamsPanel from './components/BaseParamsPanel';
import ContractDefinitionPanel from './components/ContractDefinitionPanel';

//MUI Stuff:
import { Grid, Paper, Button, Typography } from '@mui/material'

//Redux Stuff:
import { useDispatch, useSelector } from 'react-redux';
import { resetFeatureSlices } from './store';

function App() {

    const dispatch = useDispatch();

    //State for contractTypes fetched from the API
    const [contractTypes, setContractTypes] = useState(undefined);

    //States for basic params
    const network = useSelector((state) => {
        return state.network.network;
    });

    const currency = useSelector((state) => {
        return state.currency.currency;
    });
    
    const contractType = useSelector((state) => {
        return state.contractType.contractType;
    });

    //States for contractTemplate fecthed from the API
    const [contractTemplate, setContractTemplate] = useState({});

    const handleNewContractButtonClick = async () => {
        setContractTemplate({});
        dispatch(resetFeatureSlices());
        const apiResponse = await api.getContractTypes();
        setContractTypes(apiResponse);
    }

    const handleDefineClausesButtonClick = async () => {

        const apiResponse = await api.getContractTemplate(network,
                                                        currency,
                                                        contractType);
        setContractTemplate(apiResponse);
    }

    return (
        <div>
            <div>
                <Button 
                    variant="contained" 
                    size="small"
                    onClick={handleNewContractButtonClick}>
                        Elaborar Novo Contrato
                </Button>
            </div>
            <div>
                    <BaseParamsPanel contractTypes={contractTypes}
                                    handleDefineClausesButtonClick={handleDefineClausesButtonClick} />
            </div>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} style={{ padding: 16 }}>
                        <Typography>
                            <p><b>DEFINIÇÃO DE REGRAS</b></p>
                        </Typography>
                        
                        <div>
                            <ContractDefinitionPanel contractTemplate={contractTemplate}/>
                        </div>
                        <Paper>
                            <p>
                                REDUX STATES:
                            </p>
                            {JSON.stringify(useSelector((state) => {
                                return state;
                            }))}
                        </Paper>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={1} style={{ padding: 16 }}>
                        <Typography>
                            <p><b>TEXTO DO CONTRATO</b></p>
                        </Typography>   
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;