import io from 'socket.io-client';
import * as types from 'src/redux/actions/types';
import { ADD_NOTIFICATION_UNREAD_COUNT, SET_NOTIFICATION_UNREAD_COUNT } from 'src/redux/actions/types';
import debounce from 'lodash/debounce';
import fetchAPI from 'utils/fetch-api';
import { API_GET_SOCKETIO_AUTH_KEY } from './apis';
import { ApiStatus, UserSocketEvent } from './const';
import Emitter from 'redux/actions/emitter';

let WS;

export const authUserSocket = debounce(async (dispatch) => {
    try {
        const res = await fetchAPI({
            url: API_GET_SOCKETIO_AUTH_KEY,
            options: {
                method: 'GET',
            },
        });
        const {
            status,
            data
        } = res;
        if (status === ApiStatus.SUCCESS) {
            const {
                userId,
                key
            } = data;
            WS.emit('authorize', userId, key, user => {
                if (!user || !user.id || user.id !== userId) {
                    // console.error('SocketIO unauthorized!');
                    dispatch({
                        type: types.SET_SOCKET_AUTHORIZE_STATUS,
                        payload: false,
                    });
                } else {
                    // console.info('SocketIO authorized');
                    // onAuthorized(userId);
                    dispatch({
                        type: types.SET_SOCKET_AUTHORIZE_STATUS,
                        payload: true,
                    });
                }
            });
        }
    } catch (e) {
        // console.info('SocketIO authorized');
    }
}, 1000);

function onChangeWallet(socket, dispatch) {
    const event = `user:update_balance`;
    const WalletType = {
        SPOT: 0,
        MARGIN: 1,
        FUTURES: 2,
        P2P: 3,
        POOL: 4,
        EARN: 5
    };

    const WalletMap = [
        'SPOT',
        'MARGIN',
        'FUTURES',
        'P2P',
        'POOL',
        'EARN',
    ];

    Object.values(WalletType)
        .forEach(_type => {
            const eventKey = event + (_type > 0 ? `:${_type}` : '');
            socket.on(eventKey, data => {
                dispatch({
                    type: types.UPDATE_WALLET,
                    payload: data,
                    walletType: WalletMap[_type],
                });
            });
        });

}

function onFuturesUpdate(socket, dispatch) {
    socket.on('future:update_order', data => {
        console.log('__ future:update_order', data);
    });

    socket.on('future:update_balance_position', data => {
        console.log('__ future:update_balance_position', data);
    });
}

function initNotification(socket, dispatch) {
    if (socket) {
        socket.removeListener('new_notification');
        socket.on('new_notification', data => {
            dispatch({
                type: ADD_NOTIFICATION_UNREAD_COUNT,
            });
        });
    }
}

function initNotificationRepatch(socket, dispatch) {
    if (socket) {
        socket.removeListener('notifications:set_unread_count');
        socket.on('notifications:set_unread_count', value => {
            dispatch({
                type: SET_NOTIFICATION_UNREAD_COUNT,
                payload: value,
            });
        });
    }
}

function initUserSocket() {
    return dispatch => {
        WS = io(process.env.NEXT_PUBLIC_USER_SOCKET, {
            transports: ['websocket'],
            path: '/ws',
            reconnection: true,
            reconnectionDelay: 100,
            reconnectionDelayMax: 500,
            reconnectionAttempts: Infinity,
        });

        WS.on('connect', () => {
            console.log('>> User socket connected');
            dispatch({
                type: types.SET_USER_SOCKET,
                payload: WS,
            });
            authUserSocket(dispatch);
            onChangeWallet(WS, dispatch);
            onFuturesUpdate(WS, dispatch);
            initNotification(WS, dispatch);
            initNotificationRepatch(WS, dispatch);
            WS.on(UserSocketEvent.EXCHANGE_UPDATE_ORDER, (data) => {
                Emitter.emit(UserSocketEvent.EXCHANGE_UPDATE_ORDER, data);
            });
        });
        WS.on('disconnect', () => {
            // console.log('>> User socket disconnected');
            dispatch({
                type: types.SET_USER_SOCKET,
                payload: null,
            });
        });
    };
}

export default initUserSocket;
