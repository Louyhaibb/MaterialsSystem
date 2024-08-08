import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { removeToken, removeUserData, setUserData } from '../../utils/Utils';
import { logout, setUser } from './userSlice';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query(user) {
                return {
                    url: '/users/create',
                    method: 'POST',
                    credentials: 'include',
                    body: user,
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateUser: builder.mutation({
            query({ id, user }) {
                return {
                    url: `/users/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: user,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Users', id },
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getUser: builder.query({
            query(id) {
                return {
                    url: `/users/getOneUser/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),
        getUsers: builder.query({
            query(args) {
                return {
                    url: `/users`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Users',
                            id,
                        })),
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        getProfile: builder.query({
            query() {
                return {
                    url: `/users/getProfile`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),
        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/users/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        uploadAvatarImg: builder.mutation({
            query(avatarFile) {
                var formData = new FormData();
                formData.append('avatarFile', avatarFile);
                return {
                    url: '/users/upload/avatarFile',
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse(result) {
                return result;
            },
        }),
        uploadProfileImg: builder.mutation({
            query(avatarFile) {
                var formData = new FormData();
                formData.append('avatarFile', avatarFile);
                return {
                    url: '/users/upload/profile/avatarFile',
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse(result) {
                return result;
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                    setUserData(JSON.stringify(response.data.updateAvatar));
                    dispatch(setUser(response.data.updateAvatar));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query() {
                return {
                    url: '/users/logout',
                    credentials: 'include',
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    removeToken();
                    removeUserData();
                    dispatch(logout());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    }),
});

export const {
    useCreateUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUsersQuery,
    useGetUserQuery,
    useGetProfileQuery,
    useUploadProfileImgMutation,
    useLogoutUserMutation,
    useUploadAvatarImgMutation,
} = userAPI;
