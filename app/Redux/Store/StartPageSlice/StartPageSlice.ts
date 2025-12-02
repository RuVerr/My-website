import { createSlice } from "@reduxjs/toolkit";

interface initialProp {
  active: boolean;
  activeSound: boolean;
}

const initialState: initialProp = {
  active: true,
  activeSound: false
};

export const StartSlice = createSlice({
  name: "StartPage",
  initialState,
  reducers: {
    deactivateStartPage: (state) => {
      state.active = false;
    },
    activateSound: (state) => {
      state.activeSound = !state.activeSound;
    }
  }
});

export const { deactivateStartPage, activateSound } = StartSlice.actions;
export default StartSlice.reducer;
