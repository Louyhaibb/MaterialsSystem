import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const statsAPI = createApi({
    reducerPath: 'statsAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Stats'],
    endpoints: (builder) => ({
        getStatistics: builder.query({
            query() {
                return {
                    url: `/statistics`,
                    credentials: 'include',
                };
            },
            transformResponse: (results) =>
                results,
        }),
  }),
});

export const {
    useGetStatisticsQuery,
} = statsAPI;
