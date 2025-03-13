import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./portfolioSlice";
import pricesReducer from "./pricesSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    prices: pricesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
