/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */

import * as types from '../actions/types';

export const initialState = {
    user: null,
    accessToken: null,
    loadingUser: true,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_USER:
            return {
                ...state, user: payload,
            };
        case types.SET_ACCESS_TOKEN:
            return {
                ...state, accessToken: payload,
            };
        case types.SET_LOADING_USER:
            return { ...state, loadingUser: payload };

        case types.UPDATE_PROFILE_NAME_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    name: payload,
                },
            };
        }
        case types.SET_PROFILE_AVATAR_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar: payload,
                },
            };
        }
        case types.UPDATE_PROFILE_PHONE_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    phone: payload,
                },
            };
        }
        case types.UPDATE_PROFILE_EMAIL_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    email: payload,
                },
            };
        }
        case types.UPDATE_PROFILE_USERNAME_SUCCESS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    username: payload,
                },
            };
        }
        default:
            return state;
    }
};
