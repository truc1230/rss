import fetchAPI from 'utils/fetch-api';
import * as types from 'src/redux/actions/types';
import { ApiStatus } from './const';
import { API_IEO_PROJECTS, } from './apis';

export const buyIEOToken = ({ projectId, amount, cancelToken }) => async (dispatch) => {
    try {
        dispatch({ type: types.BUY_IEO_TOKEN_REQUEST });
        const opts = {
            url: `${API_IEO_PROJECTS}/${projectId}/buy`,
            options: {
                method: 'POST',
            },
            params: {
                amount,
            },
            cancelToken,
        };
        const res = await fetchAPI(opts);
        const { status, code, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.BUY_IEO_TOKEN_SUCCESS,
            });
            return data;
        }
        dispatch({
            type: types.BUY_IEO_TOKEN_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.BUY_IEO_TOKEN_FAILURE,
        });
    }
};
