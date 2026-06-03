"use client"

import {configureStore} from '@reduxjs/toolkit'
import { adminApi } from './services/adminApi';

export const makeStore = ()=> configureStore({
    reducer: {
        [adminApi.reducerPath]: adminApi.reducer 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
    .concat(adminApi.middleware)
})

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];