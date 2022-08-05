/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const initialState = {
    userSocket: null,
    publicSocket: null,
    authorized: false,
};

const Socket = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_USER_SOCKET:
            return {
                ...state, userSocket: action.payload,
            };
        case types.SET_PUBLIC_SOCKET:
            return {
                ...state, publicSocket: action.payload,
            };
        case types.SET_SOCKET_AUTHORIZE_STATUS: {
            return { ...state, authorized: action.payload };
        }
        default:
            return state;
    }
};

export default Socket
