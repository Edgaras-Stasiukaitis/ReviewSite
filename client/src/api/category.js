import { apiUrl } from '../utilities/constants';

export const getCategories = async (id = '') => {
    const result = await fetch(`${apiUrl}/Categories/${id}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const addCategory = async (params) => {
    const category = { 
        Name: params.name, 
        ImageUrl: params.imageUrl
    };
    const result = await fetch(`${apiUrl}/Categories`,
    {
        method: 'POST',
        body: JSON.stringify(category),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const updateCategory = async (params) => {
    const category = { 
        Name: params.name, 
        ImageUrl: params.imageUrl
    };
    const result = await fetch(`${apiUrl}/Categories/${params.id}}`,
    {
        method: 'PUT',
        body: JSON.stringify(category),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}

export const deleteCategory = async (params) => {
    const result = await fetch(`${apiUrl}/Categories/${params.id}}`,
    {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.token}`
        }
    });
    return result;
}
