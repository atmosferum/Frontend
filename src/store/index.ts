import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
// @ts-ignore
import { api } from './api';
import { storeActions, storeReducer, storeSlice } from './store.slice';
import thunk from 'redux-thunk';
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    store: storeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
