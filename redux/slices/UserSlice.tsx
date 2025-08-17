import {IAccountInfo} from "../../types";
import {PayloadAction, createSlice} from "@reduxjs/toolkit";

const initialState: IAccountInfo = {};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (_, action: PayloadAction<IAccountInfo>) => {
      return action.payload;
    },
    logoutUser: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {loginUser, logoutUser} = UserSlice.actions;

export default UserSlice.reducer;
