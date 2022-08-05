import { UPDATE_TIMESTAMP_RELOAD_APP } from 'redux/actions/types';
import { getFuturesConfigs, getOrdersList } from 'redux/actions/futures';
import { getAssetConfig } from 'redux/actions/market';

function updateTimestamp() {
    return {
        type: UPDATE_TIMESTAMP_RELOAD_APP,
    };
}

export function reloadData() {
    return dispatch => {
        dispatch(updateTimestamp());
        dispatch(getAssetConfig());
        dispatch(getFuturesConfigs());
    };
}
