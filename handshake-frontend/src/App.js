import React from 'react';
import api from './api';
import { useState } from 'react';
import BaseParamsPanel from './components/BaseParamsPanel';
import ContractDefinitionPanel from './components/ContractDefinitionPanel';

//MUI Stuff:
import { Grid, Paper, Button, Typography } from '@mui/material'

//Redux Stuff:
import { useSelector } from 'react-redux';

function App() {

    //State for contractTypes fetched from the API
    const [contractTypes, setContractTypes] = useState(undefined);

    //States for basic params
    const [currency, setCurrency] = useState(1);
    const [network, setNetwork] = useState(1);
    const [contractType, setContractType] = useState(1);

    //States for contractTemplate fecthed from the API
    const [contractTemplate, setContractTemplate] = useState({});

    const handleNewContractButtonClick = async () => {
        const apiResponse = await api.getContractTypes();
        setContractTypes(apiResponse);
    }

    const handleDefineClausesButtonClick = async () => {
        const apiResponse = await api.getContractTemplate(network,
                                                        currency,
                                                        contractType);
        setContractTemplate(apiResponse);

        //TODO -> RESETAR STORE DO REDUX

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
                                    network={network}
                                    currency={currency}
                                    setContractType={setContractType}
                                    setNetwork={setNetwork}
                                    setCurrency={setCurrency}
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
                        {/* <Paper>
                            <p>
                                REDUX STATES:
                            </p>
                            {JSON.stringify(useSelector((state) => {
                                return state;
                            }))}
                        </Paper> */}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={1} style={{ padding: 16 }}>
                        <Typography>
                            <p><b>CLÁUSULAS CONTRATUAIS</b></p>
                        </Typography>   
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;