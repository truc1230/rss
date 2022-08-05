/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import {
    ADD_NOTIFICATION,
    ADD_NOTIFICATION_UNREAD_COUNT,
    NOTIFICATION_MARK_ALL_AS_READ,
    SET_NOTIFICATION,
    SET_NOTIFICATION_UNREAD_COUNT,
} from '../actions/types';

import { NotificationStatus } from '../actions/const';

const INITIAL_STATE = {
    notificationsUnread: null,
    notificationsRead: null,
    notificationsMix: null,
    hasNextNotification: false,
    unreadCount: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_NOTIFICATION:
            return { ...state,
                notificationsMix: action.mix,
                hasNextNotification: action.hasNext != null ? action.hasNext : state.hasNextNotification,
            };
        case ADD_NOTIFICATION: return { ...state,
            notificationsMix: [...(state.notificationsMix || []), ...(action.mix || [])],
            hasNextNotification: action.hasNext,
        };

        case SET_NOTIFICATION_UNREAD_COUNT: return { ...state,
            unreadCount: action.payload,
        };
        case ADD_NOTIFICATION_UNREAD_COUNT: return { ...state,
            unreadCount: (state.unreadCount || 0) + 1,
        };

        case NOTIFICATION_MARK_ALL_AS_READ: {
            const ids = action.ids || [];
            // All notifications to read state
            let mix = state.notificationsMix;
            if (mix && Array.isArray(mix)) {
                mix.forEach(e => {
                    if (ids.includes(e.id)) e.status = NotificationStatus.READ;
                });
                mix = [...mix];
            }
            return { ...state,
                notificationsMix: mix,
                unreadCount: 0,
            };
        }

        default:
            return state;
    }
};
