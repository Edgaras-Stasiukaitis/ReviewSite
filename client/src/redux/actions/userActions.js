import { userConstants } from "../constants";
import { refreshToken } from "../../api/user";

export const loginAction = (token) => (dispatch) => {
  localStorage.setItem("user", JSON.stringify(token));
  dispatch({ type: userConstants.LOGIN, payload: token });
};

export const logoutAction = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch({ type: userConstants.LOGOUT });
  window.location.reload();
};

export const refreshTokenAction = (user) => async (dispatch) => {
  if (!user.loggedIn) return null;
  if (Date.now() <= user.data.exp * 1000) return null;
  const payload = {
    token: user.token,
    refreshToken: user.refreshToken
  }
  const result = await refreshToken(payload);
  if (result.ok) {
    const newToken = await result.json();
    localStorage.setItem("user", JSON.stringify(newToken));
    dispatch({ type: userConstants.REFRESH, payload: newToken });
    return newToken;
  }
  dispatch({ type: userConstants.LOGOUT })
  window.location.reload();
  return null;
}