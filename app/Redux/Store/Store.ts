import { configureStore } from "@reduxjs/toolkit";
import StartReducer from "./StartPageSlice/StartPageSlice";

export const store = configureStore({
  reducer: {
    StartPage: StartReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
