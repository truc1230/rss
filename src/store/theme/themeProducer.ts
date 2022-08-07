import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: "",
};
export const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {},
  extraReducers: {},
});
