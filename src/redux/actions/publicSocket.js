import io from 'socket.io-client';
import * as types from 'src/redux/actions/types';

import Emitter from 'src/redux/actions/emitter';
import { PublicSocketEvent } from 'src/redux/actions/const';
import throttle from 'lodash/throttle';
import { SET_MULTI_FUTURES_MARKET_WATCH } from 'src/redux/actions/types';
import { reloadData } from 'redux/actions/heath';

let WS;
let lastPrice = 0;
let futuresLastPrice = 0;

const updateDepthChart = throttle((data) => {
    Emitter.emit(PublicSocketEvent.SPOT_DEPTH_UPDATE + 'depth', data);
}, 3000);

const updateMultipleMarkPrice = (() => {
    const data = {};

    const update = throttle((data) => {
        Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE + 'markPrices', data);
    }, 1000);

    return (tick) => {
        data[tick.s] = tick;
        update(data);
    };
})();

export const bunchUpdateFuturesMarketPrice = {};

const updateMultipleMiniTicker = throttle((dispatch) => {
    dispatch({
        type: SET_MULTI_FUTURES_MARKET_WATCH,
        payload: bunchUpdateFuturesMarketPrice,
    });
}, 1000, { leading: true, trailing: true });

function initPublicSocket() {
    return (dispatch) => {
        WS = io(process.env.NEXT_PUBLIC_STREAM_SOCKET, {
            // transports: ['websocket'],
            transports: ['websocket'],
            upgrade: false,
            path: '/ws',
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 500,
            reconnectionAttempts: Infinity,
        });
        WS.on('connect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: WS,
            });

            WS.on(PublicSocketEvent.SPOT_DEPTH_UPDATE, (data) => {
                Emitter.emit(
                    PublicSocketEvent.SPOT_DEPTH_UPDATE + 'order_book',
                    data,
                );
                updateDepthChart(data);
            });

            WS.on(PublicSocketEvent.SPOT_TICKER_UPDATE, (data) => {
                if (data?.p !== lastPrice) {
                    lastPrice = data?.p;
                    Emitter.emit(PublicSocketEvent.SPOT_TICKER_UPDATE, data);
                }
            });

            WS.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, (data) => {
                futuresLastPrice = data?.c;
                Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE, data);
                updateMultipleMarkPrice(data);
            });

            WS.on(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE, (data) => {
                Emitter.emit(
                    PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + data.s,
                    data,
                );
                bunchUpdateFuturesMarketPrice[data.s] = data;
                updateMultipleMiniTicker(dispatch);
            });

            WS.on(PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE, (data) => {
                Emitter.emit(
                    PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE + data.s,
                    data,
                );
            });

            WS.on(PublicSocketEvent.FUTURES_DEPTH_UPDATE, (data) => {
                Emitter.emit(PublicSocketEvent.FUTURES_DEPTH_UPDATE, data);
            });
        });

        WS.on('reconnect', () => {
            dispatch(reloadData());
        });

        WS.on('disconnect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: null,
            });
        });
    };
}

export function reconnectPublicSocket() {
    if (typeof WS.reconnect === 'function') {
        WS.reconnect();
    }
}

export default initPublicSocket;
