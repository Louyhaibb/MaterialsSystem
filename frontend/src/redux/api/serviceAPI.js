import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const serviceAPI = createApi({
    reducerPath: 'serviceAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Services'],
    endpoints: (builder) => ({
        createService: builder.mutation({
            query(service) {
                return {
                    url: '/services/create',
                    method: 'POST',
                    credentials: 'include',
                    body: service,
                };
            },
            invalidatesTags: [{ type: 'Services', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateService: builder.mutation({
            query({ id, service }) {
                return {
                    url: `/services/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: service,
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
        getService: builder.query({
            query(id) {
                return {
                    url: `/services/getOneService/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Services', id }],
        }),
        getServices: builder.query({
            query(args) {
                return {
                    url: `/services`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Services',
                            id,
                        })),
                        { type: 'Services', id: 'LIST' },
                    ]
                    : [{ type: 'Services', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteService: builder.mutation({
            query(id) {
                return {
                    url: `/services/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Services', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateServiceMutation,
    useDeleteServiceMutation,
    useUpdateServiceMutation,
    useGetServiceQuery,
    useGetServicesQuery,
} = serviceAPI;
