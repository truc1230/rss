import FetchApi from 'utils/fetch-api';
import { API_PROMOTION_1VIDB, API_PROMOTION_1VIDB_CLAIM } from './apis';
import { ApiStatus } from './const';

export async function getPromo1VIDBStatus() {
    try {
        const opts = {
            url: API_PROMOTION_1VIDB,
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

export async function claimPromo1VIDBStatus() {
    try {
        const opts = {
            url: API_PROMOTION_1VIDB_CLAIM,
            options: {
                method: 'POST',
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
