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
    }),
});

export const {
    useLeaveReviewMutation,
} = reviewAPI;
