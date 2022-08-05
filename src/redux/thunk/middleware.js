// import async from 'neo-async';
import fetchAPI from 'src/utils/fetch-api';
import AuthStorage from 'src/utils/auth-storage';
import * as types from 'src/redux/actions/types';

const mandatory = () => {
    throw new Error('Missing parameter!');
};

const singleApi = async (dataApi = mandatory(), dispatch) => {
    const {
        url = mandatory(),
        options,
        payload = {},
        beforeCallPayload = {},
        beforeCallType,
        successType,
        errorType,
        next = f => f,
    } = dataApi;

    try {
        dispatch({ type: 'START_LOADING' });

        if (beforeCallType) {
            dispatch({ type: beforeCallType, payload: beforeCallPayload });
        }

        const response = await fetchAPI({
            url,
            options,
            payload,
            dispatch,
        });

        next(null, response, dispatch);

        if (successType) {
            dispatch({ type: successType, payload: response });
        }

        dispatch({ type: 'STOP_LOADING' });
        return response;
    } catch (error) {
        next(error);

        if (errorType) {
            dispatch({ type: errorType, payload: error });
        }

        dispatch({ type: 'STOP_LOADING' });

        if (error.status === 403 || error.status === 401) {
            AuthStorage.destroy();
            dispatch({ type: 'LOGOUT_SUCCESS' });
        }

        // dispatch({ type: REQUEST_ERROR, payload: error });
        throw error;
    }
};

export default ({ dispatch }) => next => action => {
    switch (action.type) {
        case types.SINGLE_API:
            return singleApi(action.payload, dispatch);
        default:
            return next(action);
    }
};
