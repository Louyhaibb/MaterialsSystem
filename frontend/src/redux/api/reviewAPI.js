import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const reviewAPI = createApi({
    reducerPath: 'reviewAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Reviews'],
    endpoints: (builder) => ({
        leaveReview: builder.mutation({
            query(review) {
                return {
                    url: '/reviews/leave-review',
                    method: 'POST',
                    credentials: 'include',
                    body: review,
                };
            },
            invalidatesTags: [{ type: 'Reviews', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        getReviews: builder.query({
            query(id) {
              return {
                url: `/reviews/getReview/${id}`,
                credentials: 'include'
              };
            },
            providesTags: (result, error, id) => {
              return [{ type: 'Reviews', id }];
            },
            transformResponse(result) {
              return result;
            },
          }),
    }),
});

export const {
    useLeaveReviewMutation,
    useGetReviewsQuery
} = reviewAPI;
