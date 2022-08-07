import { getProductAction } from "./productThunk";
import { createSlice } from "@reduxjs/toolkit";
import Lodash from "@lodash";

const initialState = "";
export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    productAction: () => {
      console.log(Lodash.assign({ a: 1 }, { b: 2 }));
      return "abc";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductAction.fulfilled, (state, action) => {
      console.log(action, "actionrwe");
      console.log(state, "state");
    });
  },
});
