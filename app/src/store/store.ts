import { configureStore } from "@reduxjs/toolkit";
import communityReducer from "./slices/communitySlice"; // Import the slice you created

const store = configureStore({
  reducer: {
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
