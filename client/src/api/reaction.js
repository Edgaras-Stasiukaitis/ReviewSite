import { apiUrl } from '../utilities/constants';

export const getReactions = async (categoryId, itemId, reviewId, reactionId='') => {
    const result = await fetch(`${apiUrl}/Categories/${categoryId}/Items/${itemId}/Reviews/${reviewId}/Reactions/${reactionId}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const addReaction = async (params) => {
    const reaction = {
        ReactionState: params.reactionState,
    };
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}/Reviews/${params.reviewId}/Reactions`,
    {
        method: 'POST',
        body: JSON.stringify(reaction),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const updateReaction = async (params) => {
    const reaction = {
        ReactionState: params.reactionState,
    };
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}/Reviews/${params.reviewId}/Reactions/${params.reactionId}`,
    {
        method: 'PUT',
        body: JSON.stringify(reaction),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const deleteReaction = async (params) => {
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}/Reviews/${params.reviewId}/Reactions/${params.reactionId}`,
    {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}
