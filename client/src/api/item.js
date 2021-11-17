import { apiUrl } from '../utilities/constants';

export const getItems = async (categoryId, itemId = '') => {
    const result = await fetch(`${apiUrl}/Categories/${categoryId}/Items/${itemId}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const addItem = async (params) => {
    const item = { 
        Name: params.name,
        Description: params.description,
        ImageUrl: params.imageUrl
    };
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items`,
    {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const updateItem = async (params) => {
    const item = { 
        Name: params.name,
        Description: params.description,
        ImageUrl: params.imageUrl
    };
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}`,
    {
        method: 'PUT',
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const deleteItem = async (params) => {
    const result = await fetch(`${apiUrl}/Categories/${params.categoryId}/Items/${params.itemId}`,
    {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}
