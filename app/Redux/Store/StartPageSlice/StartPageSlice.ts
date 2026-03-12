import { createSlice } from "@reduxjs/toolkit";

interface initialProp {
  activeSound: boolean;
}

const initialState: initialProp = {
  activeSound: false
};

export const StartSlice = createSlice({
  name: "StartPage",
  initialState,
  reducers: {
    activateSound: (state) => {
      state.activeSound = !state.activeSound;
    }
  }
});

export const { activateSound } = StartSlice.actions;
export default StartSlice.reducer;
