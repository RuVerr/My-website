"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../Store/Store";

export default function provider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
