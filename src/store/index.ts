import { themeSlice } from './theme/themeReducer';
import {
    configureStore,
    ThunkDispatch,
    ThunkAction,
    combineReducers,
    AnyAction
} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { walletSlice } from './wallet/walletReducer';

// Initial states
const preloadedState = {};

const rootReducer = combineReducers({
    wallet: walletSlice.reducer,
    theme: themeSlice.reducer
});
const persistConfig = {
    key: 'root',
    storage: storage
};
const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: (getDefaultMiddleware) => {
        // if (process.env.NODE_ENV === 'development') {
        //     const { logger } = require(`redux-logger`);
        //     return getDefaultMiddleware().concat(logger);
        // }
        return getDefaultMiddleware();
    },
    devTools: process.env.NODE_ENV === 'development',
    preloadedState
});

export type StoreState = ReturnType<typeof store.getState>;
export type ReduxState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<TypedDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
export const persistor = persistStore(store);
