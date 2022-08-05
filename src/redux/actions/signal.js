import FetchApi from 'src/utils/fetch-api';
import { API_SIGNAL_ASSET_NOTIFICATION } from './apis';
import { ApiStatus } from './const';

export async function getSignalNotification({ asset, page = 1, pageSize, category, cancelToken }) {
    try {
        const opts = {
            url: API_SIGNAL_ASSET_NOTIFICATION,
            options: {
                method: 'GET',
            },
            params: {
                asset,
                page,
                pageSize,
            },
            cancelToken,
        };

        if (category) opts.params.category = category;
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
