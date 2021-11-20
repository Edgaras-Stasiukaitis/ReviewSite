import { apiUrl } from '../utilities/constants';

export const getReviews = async (categoryId, itemId, reviewId = '') => {
    const result = await fetch(`${apiUrl}/Categories/${categoryId}/Items/${itemId}/Reviews/${reviewId}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const addReview = async (params) => {
    const review = {
        Title: params.title,
        Description: params.description,
        Rating: params.rating
    };
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}/Reviews`,
    {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const updateReview = async (params) => {
    const review = {
        Title: params.title,
        Description: params.description,
        Rating: params.rating
    };
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}/Reviews/${params.reviewId}`,
    {
        method: 'PUT',
        body: JSON.stringify(review),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const deleteReview = async (params) => {
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}/Reviews/${params.reviewId}`,
    {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}
