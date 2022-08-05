import FetchApi from 'src/utils/fetch-api';
import { API_DEPOSIT_CONFIG } from './apis';
import { ApiStatus } from './const';

export async function getDepositConfig() {
    try {
        const opts = {
            url: API_DEPOSIT_CONFIG,
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
    } catch (e) {
        return null;
    }
}
