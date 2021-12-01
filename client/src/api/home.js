import { apiUrl } from '../utilities/constants';

export const getRecentReviews = async (amount) => {
    const result = await fetch(`${apiUrl}/Home/Recent/${amount}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const getPopularReviews = async (amount) => {
    const result = await fetch(`${apiUrl}/Home/Popular/${amount}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}
