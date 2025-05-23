import * as React from 'react';
import { Provider } from 'react-redux';
import { config } from '@/config';
import { authApiSlice } from '@/redux/api/auth/slice';
import { forgotPasswordApiSlice } from '@/redux/api/forgot-password/slice';
import { sessionApiSlice } from '@/redux/api/session/slice';
import { userAccountApiSlice } from '@/redux/api/user-account/slice';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { mainSlice } from '@/redux/store/main-slice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // api
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
    [userAccountApiSlice.reducerPath]: userAccountApiSlice.reducer,
    [forgotPasswordApiSlice.reducerPath]: forgotPasswordApiSlice.reducer,
    // regular
    [mainSlice.reducerPath]: mainSlice.reducer,
  },
  devTools: config.isDev,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat([
        authApiSlice.middleware,
        sessionApiSlice.middleware,
        userAccountApiSlice.middleware,
        forgotPasswordApiSlice.middleware,
      ]),
});

type RootState = ReturnType<typeof store.getState>;

type Props = {
  children: React.ReactNode;
};

const ReduxStoreWrapper: React.FC<Props> = ({ children }): React.ReactElement => (
  <Provider store={store}>{children}</Provider>
);

export { ReduxStoreWrapper, type RootState, store };
