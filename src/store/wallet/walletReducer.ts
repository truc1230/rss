import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selected: ''
};
export const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialState,
    reducers: {},
    extraReducers: {}
});
