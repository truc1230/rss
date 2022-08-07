import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProductAction = createAsyncThunk("product/get", async () => {
  console.log("async thunk");
  return "abc";
});
