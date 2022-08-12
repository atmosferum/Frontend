import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_PATH = '/api/v1';
export const api = createApi({
  reducerPath: 'whattime',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  endpoints: (build) => ({
    postLogin: build.query<void, void>({
      query: () => 'login',
    }),
    getCurrentUser: build.query({
      query: () => 'currentUser',
    }),
    postEvent: build.query<string, { title: string; description: string }>({
      query: ({ title, description }) => ({
        url: 'events',
        method: 'POST',
        body: { description, title },
      }),
    }),
  }),
});
export const { useLazyGetCurrentUserQuery, useLazyPostLoginQuery, useLazyPostEventQuery } = api;
