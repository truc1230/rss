import { themeSlice } from "./theme/themeProducer";
import {
  configureStore,
  ThunkDispatch,
  ThunkAction,
  combineReducers,
  AnyAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { productSlice } from "./product/productReducer";

// Initial states
const preloadedState = {};

const rootReducer = combineReducers({
  product: productSlice.reducer,
  theme: themeSlice.reducer,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === "development") {
      const { logger } = require(`redux-logger`);

      return getDefaultMiddleware().concat(logger);
    }

    return getDefaultMiddleware();
  },
  devTools: process.env.NODE_ENV === "development",
  preloadedState,
});

export type StoreState = ReturnType<typeof store.getState>;
export type ReduxState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  AnyAction
>;

export const useAppDispatch = () => useDispatch<TypedDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
