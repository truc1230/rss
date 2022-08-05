/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

import { WalletType } from '../actions/const';

export const initialState = {
    SPOT: {},
    MARGIN: {},
    FUTURES: {},
    P2P: {},
    POOL: {},
    EARN: {},
    paymentConfigs: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_WALLET:
            let { walletType } = action
            if (!walletType) walletType = WalletType.SPOT
            if (!state[walletType]) {
                return { ...state, [walletType]: action.payload }
            }
            const balance = { ...state[walletType], ...action.payload }
            return { ...state, [walletType]: balance }
        case types.UPDATE_ALL_WALLET:
            const updateData = {}
            // eslint-disable-next-line no-restricted-syntax
            for (const key in action.payload) {
                if (action.payload.hasOwnProperty(key)) {
                    updateData[key] = action?.payload?.[key]
                }
            }
            return { ...state, ...updateData }
        case types.SET_QUOTE_ASSET:
            return { ...state, quoteAsset: action.payload }
        case types.SET_PAYMENT_CONFIG:
            return { ...state, paymentConfigs: action.payload }
        default:
            return state
    }
}
