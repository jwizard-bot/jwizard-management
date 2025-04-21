import { enqueueSnackbar } from 'notistack';
import { baseQuery } from '@/redux/api/base-query';
import {
  AccountEmailResDto,
  ChangePasswordReqDto,
  SendTestEmailReqDto,
  UpdateAccountEmailReqDto,
} from '@/redux/api/user-account/type';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { createApi } from '@reduxjs/toolkit/query/react';

const userAccountApiSlice = createApi({
  reducerPath: 'userAccountApiSlice',
  baseQuery: baseQuery,
  tagTypes: ['AccountEmail'],
  endpoints: builder => ({
    accountEmail: builder.query<AccountEmailResDto, void>({
      query: () => 'v1/@me/email',
      providesTags: ['AccountEmail'],
    }),
    updateAccountEmail: builder.mutation<void, UpdateAccountEmailReqDto>({
      query: reqDto => ({
        url: 'v1/@me/email',
        method: 'PATCH',
        body: reqDto,
      }),
      invalidatesTags: ['AccountEmail'],
    }),
    sendTestEmail: builder.mutation<void, SendTestEmailReqDto>({
      query: reqDto => ({
        url: 'v1/@me/email/test',
        method: 'POST',
        body: reqDto,
      }),
    }),
    changePassword: builder.mutation<void, ChangePasswordReqDto>({
      query: reqDto => ({
        url: 'v1/@me/password',
        method: 'PATCH',
        body: reqDto,
      }),
    }),
  }),
});

listenerMiddleware.startListening({
  matcher: userAccountApiSlice.endpoints.updateAccountEmail.matchFulfilled,
  effect: async () => {
    enqueueSnackbar({ message: 'Successfully updated account email.', variant: 'success' });
  },
});

listenerMiddleware.startListening({
  matcher: userAccountApiSlice.endpoints.sendTestEmail.matchFulfilled,
  effect: async () => {
    enqueueSnackbar({ message: 'Successfully sent test email.', variant: 'success' });
  },
});

listenerMiddleware.startListening({
  matcher: userAccountApiSlice.endpoints.changePassword.matchFulfilled,
  effect: async () => {
    enqueueSnackbar({ message: 'Successfully updated account password.', variant: 'success' });
  },
});

export const {
  useAccountEmailQuery,
  useUpdateAccountEmailMutation,
  useSendTestEmailMutation,
  useChangePasswordMutation,
} = userAccountApiSlice;

export { userAccountApiSlice };
