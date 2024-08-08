import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';
import userReducer from './api/userSlice';
import { userAPI } from './api/userAPI';
import { serviceAPI } from './api/serviceAPI';
import { additionalServiceAPI } from './api/additionalServiceAPI';
import { orderAPI } from './api/orderAPI';
import { reviewAPI } from './api/reviewAPI';
import { statsAPI } from './api/statsAPI';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
    [additionalServiceAPI.reducerPath]: additionalServiceAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [reviewAPI.reducerPath]: reviewAPI.reducer,
    [statsAPI.reducerPath]: statsAPI.reducer,
    userState: userReducer
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
        authAPI.middleware,
        getMeAPI.middleware,
        userAPI.middleware,
        serviceAPI.middleware,
        additionalServiceAPI.middleware,
        orderAPI.middleware,
        reviewAPI.middleware,
        statsAPI.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
