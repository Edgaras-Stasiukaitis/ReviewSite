import jwt from 'jwt-decode';
import { userConstants } from '../constants';

export default function userReducer(state = { loggedIn: false, token: null, refreshToken: null, data: null }, action) {
    switch (action.type) {
        case userConstants.LOGIN:
            return {
                loggedIn: true,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                data: jwt(action.payload.token)
            }
        case userConstants.LOGOUT:
            return {
                loggedIn: false,
                token: null,
                refreshToken: null,
                data: null
            }
        case userConstants.REFRESH:
            return {
                loggedIn: true,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                data: jwt(action.payload.token)
            }
        default:
            return state
    }
}