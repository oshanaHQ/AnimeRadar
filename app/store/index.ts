import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './animeSlice';

export const store = configureStore({
  reducer: {
    anime: animeReducer,
  },
});

// Types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
