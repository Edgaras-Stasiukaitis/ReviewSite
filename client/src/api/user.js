import { apiUrl } from '../utilities/constants';

export const login = async (username, password) => {
    const user = { 
        UserName: username, 
        Password: password 
    };
    const result = await fetch(`${apiUrl}/Users/Login`,
    {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const registration = async (username, password, email, firstname, lastname) => {
    const user = { 
        UserName: username, 
        Password: password,
        Email: email,
        FirstName: firstname,
        LastName: lastname
    };
    const result = await fetch(`${apiUrl}/Users/Register`,
    {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}

export const logout = async (token) => {
    const result = await fetch(`${apiUrl}/Users/Logout`,
    {
        method: 'POST',
        body: {},
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return result;
}

export const refreshToken = async (params) => {
    const token = { 
        token: params.token, 
        refreshToken: params.refreshToken,
    };
    const result = await fetch(`${apiUrl}/Users/RefreshToken`,
    {
        method: 'POST',
        body: JSON.stringify(token),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result;
}