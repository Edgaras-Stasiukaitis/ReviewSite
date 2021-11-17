import jwt from 'jwt-decode';

export default function userReducer(state = {loggedIn: false, token: null, data: null}, action) {
    switch(action.type) {
        case 'LOGIN':
            const userInfo = jwt(action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload));
            return {
                loggedIn: true,
                token: action.payload.token,
                data: userInfo
            }
        case 'LOGOUT':
            localStorage.removeItem("user");
            return {
                loggedIn: false,
                token: null,
                data: null
            }
        default: 
            return state
    }
}