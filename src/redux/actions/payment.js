import axios from 'axios';
import { API_GET_PAYMENT_CONFIG } from './apis';
import { SET_PAYMENT_CONFIG } from './types';
import { ApiStatus } from './const';

export function getPaymentConfigs() {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(API_GET_PAYMENT_CONFIG)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                const payload = Object.values(data.data)?.map((o) => ({
                    ...o,
                    assetCode: o?.networkList?.[0]?.coin,
                }))
                dispatch({
                    type: SET_PAYMENT_CONFIG,
                    payload,
                })
            }
        } catch (e) {
            console.log(`Can't get payment configs `, e)
        }
    }
}
