import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const orderAPI = createApi({
    reducerPath: 'orderAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getCompanyDetail: builder.query({
            query(id) {
                return {
                    url: `/orders/company-detail/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
        }),
        createOrderRequest: builder.mutation({
            query(order) {
                return {
                    url: '/orders/order-request',
                    method: 'POST',
                    credentials: 'include',
                    body: order,
                };
            },
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateOrderStatus: builder.mutation({
            query(order) {
                return {
                    url: `/orders/update-status`,
                    method: 'PUT',
                    credentials: 'include',
                    body: order,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Services', id },
                        { type: 'Services', id: 'LIST' },
                    ]
                    : [{ type: 'Services', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getOrder: builder.query({
            query(id) {
                return {
                    url: `/orders/getOneOrder/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
        }),
        getClientOrders: builder.query({
            query(args) {
                return {
                    url: `/orders/client-orders`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Orders',
                            id,
                        })),
                        { type: 'Orders', id: 'LIST' },
                    ]
                    : [{ type: 'Orders', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        getCompanyOrders: builder.query({
            query(args) {
                return {
                    url: `/orders/company-orders`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Orders',
                            id,
                        })),
                        { type: 'Orders', id: 'LIST' },
                    ]
                    : [{ type: 'Orders', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
    }),
});

export const {
    useCreateOrderRequestMutation,
    useGetClientOrdersQuery,
    useGetCompanyOrdersQuery,
    useGetOrderQuery,
    useUpdateOrderStatusMutation,
    useGetCompanyDetailQuery,
} = orderAPI;
