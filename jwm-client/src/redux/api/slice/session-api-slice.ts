import { enqueueSnackbar } from 'notistack';
import { baseQuery } from '@/redux/api/base-query';
import { CsrfResDto, RevalidateResDto } from '@/redux/api/type/session-api';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { setCsrf, setInitialized, setLoggedIn } from '@/redux/slice/main-slice';
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
    const { loggedIn, expired } = action.payload;
    if (loggedIn) {
      // fetch csrf token only if user is logged
      dispatch(sessionApiSlice.endpoints.getCsrfToken.initiate());
    } else {
      if (expired) {
        enqueueSnackbar({ message: 'Session is expired. Log in again.', variant: 'warning' });
      }
      dispatch(setInitialized(true));
    }
    dispatch(setLoggedIn(loggedIn));
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
