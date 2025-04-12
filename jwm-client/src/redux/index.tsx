import * as React from 'react';
import { Provider } from 'react-redux';
import { config } from '@/config';
import { authApiSlice } from '@/redux/api/slice/auth-api-slice';
import { sessionApiSlice } from '@/redux/api/slice/session-api-slice';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { mainSlice } from '@/redux/slice/main-slice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // api
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [sessionApiSlice.reducerPath]: sessionApiSlice.reducer,
    // regular
    [mainSlice.reducerPath]: mainSlice.reducer,
  },
  devTools: config.isDev,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat([authApiSlice.middleware, sessionApiSlice.middleware]),
});

type RootState = ReturnType<typeof store.getState>;

type Props = {
  children: React.ReactNode;
};

const ReduxStoreWrapper: React.FC<Props> = ({ children }): React.ReactElement => (
  <Provider store={store}>{children}</Provider>
);

export { ReduxStoreWrapper, type RootState, store };
