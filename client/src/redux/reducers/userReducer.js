import jwt from 'jwt-decode';

export default function userReducer(state = {loggedIn: false, token: null, data: null}, action) {
    switch(action.type) {
        case 'LOGIN':
            return {
                loggedIn: true,
                token: action.payload.token,
                data: jwt(action.payload.token)
            }
        case 'LOGOUT':
            return {
                loggedIn: false,
                token: null,
                data: null
            }
        default: 
            return state
    }
}