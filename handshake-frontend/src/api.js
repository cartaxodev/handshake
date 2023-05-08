import axios from 'axios';

const getContractTypes = async () => {
    const response = await axios.get('http://127.0.0.1:8080/api/v1/contractType', {
        headers: {

        },
        params: {

        }
    });

    //console.log(response);

    return response;
}

export default getContractTypes;