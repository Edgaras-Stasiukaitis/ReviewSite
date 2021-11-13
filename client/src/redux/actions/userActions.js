export const loginAction = (token) => (dispatch) => {
    dispatch({ type: 'LOGIN', payload: token });
  };

  export const logoutAction = () => (dispatch) => {
    dispatch({ type: 'LOGOUT' });
  };