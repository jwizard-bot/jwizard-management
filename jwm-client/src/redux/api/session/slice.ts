import { enqueueSnackbar } from 'notistack';
import { baseQuery } from '@/redux/api/base-query';
import { CsrfResDto, RevalidateResDto } from '@/redux/api/session/type';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { setCsrf, setInitialized, setLoggedUser, setRequireMfa } from '@/redux/store/main-slice';
import { createApi } from '@reduxjs/toolkit/query/react';

const sessionApiSlice = createApi({
  reducerPath: 'sessionApiSlice',
  baseQuery: baseQuery,
  endpoints: builder => ({
    revalidateSession: builder.query<RevalidateResDto, void>({
      query: () => 'v1/session/revalidate',
    }),
    getCsrfToken: builder.mutation<CsrfResDto, void>({
      query: () => 'v1/session/@me/csrf',
    }),
  }),
});

listenerMiddleware.startListening({
  matcher: sessionApiSlice.endpoints.revalidateSession.matchFulfilled,
  effect: async (action, { dispatch }) => {
    const { exists, loggedUser, requireMfa, expired } = action.payload;
    if (exists) {
      // fetch csrf token only if user is logged
      dispatch(sessionApiSlice.endpoints.getCsrfToken.initiate());
    } else {
      dispatch(setInitialized(true));
    }
    if (expired) {
      enqueueSnackbar({ message: 'Session is expired. Log in again.', variant: 'warning' });
    }
    dispatch(setRequireMfa(requireMfa));
    if (!requireMfa) {
      // set logged user only if MFA not protect account
      dispatch(setLoggedUser(loggedUser));
    }
  },
});

listenerMiddleware.startListening({
  matcher: sessionApiSlice.endpoints.getCsrfToken.matchFulfilled,
  effect: async (action, { dispatch }) => {
    dispatch(setCsrf(action.payload));
    dispatch(setInitialized(true));
  },
});

export const { useRevalidateSessionQuery } = sessionApiSlice;

export { sessionApiSlice };
