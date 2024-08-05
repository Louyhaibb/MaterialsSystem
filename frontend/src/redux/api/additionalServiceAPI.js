import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const additionalServiceAPI = createApi({
    reducerPath: 'additionalServiceAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['AdditionalServices'],
    endpoints: (builder) => ({
        createAdditionalService: builder.mutation({
            query(service) {
                return {
                    url: '/additional-services/create',
                    method: 'POST',
                    credentials: 'include',
                    body: service,
                };
            },
            invalidatesTags: [{ type: 'AdditionalServices', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateAdditionalService: builder.mutation({
            query({ id, service }) {
                return {
                    url: `/additional-services/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: service,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'AdditionalServices', id },
                        { type: 'AdditionalServices', id: 'LIST' },
                    ]
                    : [{ type: 'AdditionalServices', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getAdditionalService: builder.query({
            query(id) {
                return {
                    url: `/additional-services/getOneService/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'AdditionalServices', id }],
        }),
        getAdditionalServices: builder.query({
            query(args) {
                return {
                    url: `/additional-services`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'AdditionalServices',
                            id,
                        })),
                        { type: 'AdditionalServices', id: 'LIST' },
                    ]
                    : [{ type: 'AdditionalServices', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteAdditionalService: builder.mutation({
            query(id) {
                return {
                    url: `/additional-services/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'AdditionalServices', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateAdditionalServiceMutation,
    useUpdateAdditionalServiceMutation,
    useGetAdditionalServiceQuery,
    useGetAdditionalServicesQuery,
    useDeleteAdditionalServiceMutation,
} = additionalServiceAPI;
