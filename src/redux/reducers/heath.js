/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import { millisecondsToMinutes } from 'date-fns';
import * as types from '../actions/types';

export const initialState = {
    timestamp: millisecondsToMinutes(Date.now()),
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_TIMESTAMP_RELOAD_APP:
            return { timestamp: millisecondsToMinutes(Date.now()) };
        default:
            return state;
    }
};
