/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const initialState = {
    selectedOrder: null,
    symbolTicker: null, // For current active ticker
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_SPOT_SELECTED_ORDER:
            return { ...state, selectedOrder: action.payload };
        case types.SET_SPOT_SYMBOL_TICKER:
            return { ...state, symbolTicker: action.payload };
        default:
            return state;
    }
};
