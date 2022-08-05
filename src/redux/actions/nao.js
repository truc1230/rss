import * as types from '../actions/types';
export const requestNao = () => async (dispatch) => {
    dispatch({
        type: types.NAO_STAKE_SUCCESS,
    });
};
