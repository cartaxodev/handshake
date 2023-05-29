import axios from 'axios';

const getContractTypes = async () => {
    const response = await axios.get('http://127.0.0.1:8080/api/v1/contractType', {
        headers: {

        },
        params: {

        }
    });

    return response.data.contractTypes;
}

const getContractTemplate = async (networkId, currencyId, contractTypeId) => {
    const response = await axios.get(`http://127.0.0.1:8080/api/v1/contractTemplate/${networkId}/${currencyId}/${contractTypeId}`, {
        headers: {

        },
        params: {

        }
    });

    return response.data.contractTemplate;
}

export default { getContractTypes, getContractTemplate }