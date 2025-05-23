import { enqueueSnackbar } from 'notistack';
import {
  ChangeDefaultPasswordReqDto,
  LoginReqDto,
  LoginResDto,
  ValidateMfaResDto,
} from '@/redux/api/auth/type';
import { baseQuery } from '@/redux/api/base-query';
import { sessionApiSlice } from '@/redux/api/session/slice';
import { listenerMiddleware } from '@/redux/listener-middleware';
import {
  setCsrf,
  setDefaultPasswordState,
  setLoggedUser,
  setRequireMfa,
  setSkippedChangeDefaultPassword,
} from '@/redux/store/main-slice';
import { isAnyOf } from '@reduxjs/toolkit';
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
    validateMfa: builder.mutation<ValidateMfaResDto, string>({
      query: code => ({
        url: `v1/auth/mfa/${code}`,
        method: 'PATCH',
      }),
    }),
    validateRecoveryMfa: builder.mutation<ValidateMfaResDto, string>({
      query: code => ({
        url: `v1/auth/mfa/recovery/${code}`,
        method: 'PATCH',
      }),
    }),
    cancelMfa: builder.mutation<void, void>({
      query: () => ({
        url: 'v1/auth/mfa/cancel',
        method: 'DELETE',
      }),
    }),
    changeDefaultPassword: builder.mutation<void, ChangeDefaultPasswordReqDto>({
      query: reqDto => ({
        url: 'v1/auth/password',
        method: 'PATCH',
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
    dispatch(sessionApiSlice.endpoints.getCsrfToken.initiate());
    dispatch(setRequireMfa(payload.requireMfa));
    if (!payload.requireMfa) {
      // set logged user only if MFA not protect account
      dispatch(setLoggedUser(payload.loggedUser));
      enqueueSnackbar({ message: 'Successfully logged on account.', variant: 'success' });
    }
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(
    authApiSlice.endpoints.validateMfa.matchFulfilled,
    authApiSlice.endpoints.validateRecoveryMfa.matchFulfilled
  ),
  effect: async ({ payload }, { dispatch }) => {
    const result = payload as ValidateMfaResDto;
    dispatch(setLoggedUser(result.loggedUser));
    enqueueSnackbar({ message: 'Successfully logged on account.', variant: 'success' });
  },
});

listenerMiddleware.startListening({
  matcher: authApiSlice.endpoints.cancelMfa.matchFulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setRequireMfa(false));
  },
});

listenerMiddleware.startListening({
  matcher: authApiSlice.endpoints.changeDefaultPassword.matchFulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setDefaultPasswordState(false));
    enqueueSnackbar({ message: 'Successfully changed default password.', variant: 'success' });
  },
});

listenerMiddleware.startListening({
  matcher: authApiSlice.endpoints.logout.matchFulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setRequireMfa(false));
    dispatch(setLoggedUser(null));
    dispatch(setCsrf(null));
    dispatch(setSkippedChangeDefaultPassword(false));
    enqueueSnackbar({ message: 'Successfully logout from account.', variant: 'success' });
  },
});

export const {
  useLoginMutation,
  useValidateMfaMutation,
  useValidateRecoveryMfaMutation,
  useCancelMfaMutation,
  useChangeDefaultPasswordMutation,
  useLogoutMutation,
} = authApiSlice;

export { authApiSlice };
