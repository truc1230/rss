/* eslint-disable no-use-before-define */
import fetchAPI from 'utils/fetch-api';
import * as types from 'src/redux/actions/types';
import { ApiStatus } from './const';
import { API_EARNING_POOL_DEPOSIT, API_EARNING_POOL_WITHDRAW, API_EARNING_POOLS, } from './apis';

export const getEarningPools = ({ page, filterStatus, keyword, lastId }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_EARNING_POOLS_REQUEST });
        const opts = {
            url: API_EARNING_POOLS,
            options: {
                method: 'GET',
            },
            params: {
                page,
                limit: 10,
            },
        };
        if (lastId) {
            opts.params.lastId = lastId;
        }
        if (filterStatus) {
            opts.params.status = filterStatus;
        }
        if (keyword) {
            opts.params.keyword = keyword;
        }
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_EARNING_POOLS_SUCCESS,
            });
            return { data };
        }
        dispatch({
            type: types.GET_EARNING_POOLS_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.GET_EARNING_POOLS_FAILURE,
        });
        return false;
    }
};

export const getEarningPoolDetail = (poolId) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_EARNING_POOL_REQUEST });
        const opts = {
            url: `${API_EARNING_POOLS}/${poolId}`,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_EARNING_POOL_SUCCESS,
                // payload: data?.questions,
            });
            return data;
        }
        dispatch({
            type: types.GET_EARNING_POOL_FAILURE,
        });
        return null;
    } catch (error) {
        dispatch({
            type: types.GET_EARNING_POOL_FAILURE,
        });
        return null;
    }
};

export const depositAssetIntoPool = ({ poolId, quantity, cancelToken }) => async (dispatch) => {
    try {
        dispatch({ type: types.DEPOSIT_EARNING_POOL_REQUEST });
        const opts = {
            url: API_EARNING_POOL_DEPOSIT,
            options: {
                method: 'POST',
            },
            params: {
                poolId,
                quantity,
            },
            cancelToken,
        };
        const res = await fetchAPI(opts);
        const { status, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.DEPOSIT_EARNING_POOL_SUCCESS,
            });
            return null;
        }
        dispatch({
            type: types.DEPOSIT_EARNING_POOL_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.DEPOSIT_EARNING_POOL_FAILURE,
        });
    }
};

export const withdrawAssetInPool = ({ poolId, quantity, type, cancelToken }) => async (dispatch) => {
    try {
        dispatch({ type: types.WITHDRAW_EARNING_POOL_REQUEST });
        const opts = {
            url: API_EARNING_POOL_WITHDRAW,
            options: {
                method: 'POST',
            },
            params: {
                poolId,
                quantity,
                type,
            },
            cancelToken,
        };
        const res = await fetchAPI(opts);
        const { status, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.WITHDRAW_EARNING_POOL_SUCCESS,
            });
            return null;
        }
        dispatch({
            type: types.WITHDRAW_EARNING_POOL_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.WITHDRAW_EARNING_POOL_FAILURE,
        });
    }
};
