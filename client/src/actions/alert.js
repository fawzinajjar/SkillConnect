import { SET_ALERT, REMOVE_ALERT } from './types';
import uuid from 'uuid/v5';

export const setAlert = (msg, alertType, timeout=5000) => dispatch => {
    const id = uuid.v5;
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout)
};


