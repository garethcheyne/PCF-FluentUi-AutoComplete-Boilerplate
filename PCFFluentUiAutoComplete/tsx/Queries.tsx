import axios from 'axios';

async function fetchSuggestions(value: string, token: string) {

    const uri = `https://api.business.govt.nz/gateway/nzbn/v5/entities?page-size=35&search-term=${encodeURI(value)}`;

    return await axios.get(uri, {
        headers: {
            'Ocp-Apim-Subscription-Key': `${token}`,
            'Cache-Control': 'no-cache',
        },
    });
}


export { fetchSuggestions };