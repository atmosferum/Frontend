import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryMeta, BaseQueryResult } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { store } from './index';
import { Interval, Results } from '../types';
import { convertIntervalsToFrontend } from '../api';

const API_PATH = '/api/v1';
export const api = createApi({
  reducerPath: 'whattime',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  endpoints: (build) => ({
    results: build.query<any, void>({
      query: ({ eventId, participants }: any) => {
        return {
          url: `/events/${eventId}/result`,
        };
      },
      transformResponse(result: BaseQueryResult<any>, _, args): any {
        console.log(args);
        return convertIntervalsToFrontend(result.intervals) as Interval[];
      },
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
      transformResponse(result: BaseQueryResult<any>) {
        console.log(result);
        return result;
      },
    }),
  }),
});
export const { useLazyGetCurrentUserQuery, useLazyPostEventQuery, useResultsQuery } = api;
