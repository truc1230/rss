/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const initialState = {
    isReloadStake: false
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.NAO_STAKE_SUCCESS:
            return {
                ...state, isReloadStake: !state.isReloadStake,
            };
        default:
            return state;
    }
};
