import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState, IOrganization, IUser } from "../types/types";

const initialState: IAuthState = {
  userData: null,
  currentOrganization: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<IUser | null>) {
      state.userData = action.payload;
    },
    setCurrentOrganization(state, action: PayloadAction<IOrganization | null>) {
      state.currentOrganization = action.payload;
    },
  },
});

export const { setUserData, setCurrentOrganization } = authSlice.actions;
export default authSlice.reducer;
