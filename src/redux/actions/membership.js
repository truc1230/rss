import fetchAPI from 'utils/fetch-api';
import * as types from 'src/redux/actions/types';
import { ApiStatus } from './const';
import { API_MEMBERSHIP_STAKE_ATS, API_MEMBERSHIP_TRADING_HISTORY, API_MEMBERSHIP_UNSTAKE_ATS, } from './apis';

export const stakeATS = ({ amount, autoStake }) => async (dispatch) => {
    try {
        dispatch({ type: types.MEMBERSHIP_STAKE_ATS_REQUEST });
        const opts = {
            url: API_MEMBERSHIP_STAKE_ATS,
            options: {
                method: 'POST',
            },
            params: {
                amount,
                autoStake,
            },
        };
        const res = await fetchAPI(opts);
        const { status, code, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.MEMBERSHIP_STAKE_ATS_SUCCESS,
            });
            return null;
        }
        dispatch({
            type: types.MEMBERSHIP_STAKE_ATS_FAILURE,
        });
        return { code, data };
    } catch (error) {
        dispatch({
            type: types.MEMBERSHIP_STAKE_ATS_FAILURE,
        });
    }
};

export const unstakeATS = ({ amount }) => async (dispatch) => {
    try {
        dispatch({ type: types.MEMBERSHIP_UNSTAKE_ATS_REQUEST });
        const opts = {
            url: API_MEMBERSHIP_UNSTAKE_ATS,
            options: {
                method: 'POST',
            },
            params: {
                amount,
            },
        };
        const res = await fetchAPI(opts);
        const { status, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.MEMBERSHIP_UNSTAKE_ATS_SUCCESS,
            });
            return null;
        }
        dispatch({
            type: types.MEMBERSHIP_UNSTAKE_ATS_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.MEMBERSHIP_UNSTAKE_ATS_FAILURE,
        });
    }
};

export async function getMemberTopFiveTradingHistory() {
    try {
        const opts = {
            url: API_MEMBERSHIP_TRADING_HISTORY,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            if (data.length > 5) {
                return data.slice(0, 5);
            }
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}
