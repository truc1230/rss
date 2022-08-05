/* eslint-disable no-alert, no-console, import/no-extraneous-dependencies */
import { useMemo } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
// import apiMiddleware from 'src/redux/thunk/middleware';
import reducers from './reducers';
import { SET_MULTI_FUTURES_MARKET_WATCH } from 'redux/actions/types';

let store;

const DEV = process.browser && process.env.NODE_ENV !== 'production';
// const DEV = false;

const bindMiddleware = middleware => {
    if (DEV) {
        const { createLogger } = require('redux-logger');

        const logger = createLogger({
            predicate: (getState, action) => {
                return action.type !== SET_MULTI_FUTURES_MARKET_WATCH;
            },
            collapsed: (getState, action, logEntry) => !logEntry.error,
        });

        return applyMiddleware(...middleware, logger);
    }

    return applyMiddleware(...middleware);
};

function initStore(initialState) {
    return createStore(
        reducers,
        initialState,
        composeWithDevTools(bindMiddleware([thunkMiddleware,
            // , apiMiddleware
        ])),
    );
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? initStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        });
        // Reset the current store
        store = undefined;
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store;
};

export function useStore(initialState) {
    return useMemo(() => initializeStore(initialState), [initialState]);
}
