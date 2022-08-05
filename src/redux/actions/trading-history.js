import FetchApi from 'src/utils/fetch-api';
import { API_TRADING_HISTORY, API_TRADING_HISTORY_CATEGORY, API_TRADING_HISTORY_DETAIL } from './apis';
import { ApiStatus } from './const';

export async function getTradingHistory({ category, assetId, page = 1, from, to, transactionId = '' }) {
    try {
        const opts = {
            url: API_TRADING_HISTORY,
            options: {
                method: 'GET',
            },
            params: {
                category,
                assetId,
                page,
                pageSize: 10,
                from,
                to,
                transactionId,
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getTradingHistoryCategory() {
    try {
        const opts = {
            url: API_TRADING_HISTORY_CATEGORY,
            options: {
                method: 'GET',
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function getTradingHistoryDetail({ category, transactionId }) {
    try {
        const opts = {
            url: `${API_TRADING_HISTORY_DETAIL}?category=${category}&transactionId=${transactionId}`,
            options: {
                method: 'GET',
            },
        };
        const res = await FetchApi(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}
