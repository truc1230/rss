import compact from 'lodash/compact';
import fetchAPI from 'utils/fetch-api';
import { API_GET_NOTIFICATIONS, API_MARK_NOTIFICATIONS_READ } from './apis';
import {
    ADD_NOTIFICATION,
    ADD_NOTIFICATION_UNREAD_COUNT,
    NOTIFICATION_MARK_ALL_AS_READ,
    SET_NOTIFICATION,
} from './types';
import { ApiStatus, NotificationCategory } from './const';
// import { getSpinNotificationText, translateText } from './utils';
// import Store from '../Store';

function getSpinNotificationText() {
    return null;
}

export function getNotifications(prevId, cb) {
    return async (dispatch) => {
        try {
            const params = {};
            if (prevId !== undefined) params.prevId = prevId;
            const { status, data } = await fetchAPI({
                url: API_GET_NOTIFICATIONS,
                options: {
                    method: 'GET',
                },
                params,
            });
            if (status === ApiStatus.SUCCESS) {
                if (!prevId) {
                    dispatch({
                        type: SET_NOTIFICATION,
                        mix: data?.result,
                        hasNext: data?.hasNext,
                    });
                } else {
                    dispatch({
                        type: ADD_NOTIFICATION,
                        mix: data?.result,
                        hasNext: data?.hasNext > 0,
                    });
                }
            } else {
                dispatch({
                    type: SET_NOTIFICATION,
                    mix: false,
                    hasNext: false,
                });
            }
            if (cb) cb(data);
        } catch (err) {
            if (cb) {
                cb({
                    status: 'failed',
                });
            }
            dispatch({
                type: SET_NOTIFICATION,
                mix: false,
                hasNext: false,
            });
        }
    };
}

export function postProcessNotifications(notifications, needSound = false) {
    if (!Array.isArray(notifications)) return notifications;

    return compact(
        notifications.map(notification => {
            if (
                notification.category === NotificationCategory.MARKET_EXCHANGE
            ) {
                return {
                    ...notification,
                    content: getSpinNotificationText(notification.category, notification.metadata, true, needSound),
                };
            }
            if (notification.category === NotificationCategory.DEPOSIT_ERC20) {
                if (notification?.metadata) {
                    try {
                        // eslint-disable-next-line no-param-reassign
                        notification.metadata = JSON.parse(notification.metadata);
                    } catch (e) {
                        // console.log('NotificationCategory.DEPOSIT_ERC20 parse json error: ', e.message);
                    }
                }
                return {
                    ...notification,
                    content: '',
                };
            }
            return null;
        }),
    );
}

//
// export function updateUnreadCount() {
//     const { socket } = store().getState().userSocket;
//     if (!socket) return;
//
//     socket.emit('notifications:count_unread', value => {
//         store().dispatch({
//             type: SET_NOTIFICATION_UNREAD_COUNT,
//             payload: value,
//         });
//     });
// }

export function increaseUnreadCount() {
    return (dispatch) => {
        dispatch({
            type: ADD_NOTIFICATION_UNREAD_COUNT,
        });
    };
}

export const truncateNotifications = () => {
    return dispatch => {
        dispatch({
            type: SET_NOTIFICATION,
            mix: null,
            hasNext: false,
        });
    };
};

export async function markAllAsRead(ids) {
    return async (dispatch) => {
        const { status } = await fetchAPI({
            url: API_MARK_NOTIFICATIONS_READ,
            options: {
                method: 'PUT',
            },
            params: {
                ids,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: NOTIFICATION_MARK_ALL_AS_READ,
                ids,
            });
        }
    };
}
