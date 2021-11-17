export const getCategoryAction = (data) => (dispatch) => {
    dispatch({ type: 'GET', payload: data });
};