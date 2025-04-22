import { enqueueSnackbar } from 'notistack';
import { baseQuery } from '@/redux/api/base-query';
import {
  ChangeForgotPasswordReqDto,
  RequestForgotPasswordReqDto,
} from '@/redux/api/forgot-password/type';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { setRequestForChangePassword } from '@/redux/store/main-slice';
import { createApi } from '@reduxjs/toolkit/query/react';

const forgotPasswordApiSlice = createApi({
  reducerPath: 'forgotPasswordApiSlice',
  baseQuery: baseQuery,
  endpoints: builder => ({
    sendForgotPasswordRequest: builder.mutation<void, RequestForgotPasswordReqDto>({
      query: reqDto => ({
        url: 'v1/forgot/password/request',
        method: 'POST',
        body: reqDto,
      }),
    }),
    validateOtaToken: builder.query<void, string>({
      query: otaToken => `v1/forgot/password/token/${otaToken}/valid`,
    }),
    checkOtaToken: builder.mutation<void, string>({
      query: otaToken => `v1/forgot/password/token/${otaToken}/valid`,
    }),
    changeForgotPassword: builder.mutation<void, ChangeForgotPasswordReqDto>({
      query: reqDto => ({
        url: `v1/forgot/password`,
        method: 'PATCH',
        body: reqDto,
      }),
    }),
  }),
});

listenerMiddleware.startListening({
  matcher: forgotPasswordApiSlice.endpoints.sendForgotPasswordRequest.matchFulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setRequestForChangePassword(true));
    enqueueSnackbar({
      message: 'If provided account exists and has email address, check your mailbox.',
      variant: 'success',
    });
  },
});

listenerMiddleware.startListening({
  matcher: forgotPasswordApiSlice.endpoints.changeForgotPassword.matchFulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setRequestForChangePassword(false));
    enqueueSnackbar({
      message: 'Successfully changed password for your account.',
      variant: 'success',
    });
  },
});

export const {
  useSendForgotPasswordRequestMutation,
  useValidateOtaTokenQuery,
  useCheckOtaTokenMutation,
  useChangeForgotPasswordMutation,
} = forgotPasswordApiSlice;

export { forgotPasswordApiSlice };
