import { enqueueSnackbar } from 'notistack';
import { baseQuery } from '@/redux/api/base-query.ts';
import { sessionApiSlice } from '@/redux/api/slice/session-api-slice.ts';
import { LoginReqDto, LoginResDto } from '@/redux/api/type/auth-api.ts';
import { listenerMiddleware } from '@/redux/listener-middleware.ts';
import { setCsrf, setLoggedIn } from '@/redux/slice/main-slice.ts';
import { createApi } from '@reduxjs/toolkit/query/react';

const authApiSlice = createApi({
  reducerPath: 'authApiSlice',
  baseQuery: baseQuery,
  endpoints: builder => ({
    login: builder.mutation<LoginResDto, LoginReqDto>({
      query: reqDto => ({
        url: 'v1/auth/login',
        method: 'POST',
        body: reqDto,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'v1/auth/logout',
        method: 'DELETE',
      }),
    }),
  }),
});

listenerMiddleware.startListening({
  matcher: authApiSlice.endpoints.login.matchFulfilled,
  effect: async ({ payload }, { dispatch }) => {
    if (payload.authenticated) {
      dispatch(sessionApiSlice.endpoints.getCsrfToken.initiate());
    } else {
      enqueueSnackbar({ message: 'Incorrect username and/or password.', variant: 'error' });
    }
    dispatch(setLoggedIn(payload.authenticated));
  },
});

listenerMiddleware.startListening({
  matcher: authApiSlice.endpoints.logout.matchFulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setLoggedIn(false));
    dispatch(setCsrf(null));
    enqueueSnackbar({ message: 'Successfully logout from account.', variant: 'success' });
  },
});

export const { useLoginMutation, useLogoutMutation } = authApiSlice;

export { authApiSlice };
