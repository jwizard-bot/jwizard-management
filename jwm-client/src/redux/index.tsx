import * as React from 'react';
import { Provider } from 'react-redux';
import { config } from '@/config';
import { authApiSlice } from '@/redux/api/auth/slice';
import { sessionApiSlice } from '@/redux/api/session/slice';
import { userAccountApiSlice } from '@/redux/api/user-account/slice';
import { listenerMiddleware } from '@/redux/listener-middleware';
import { mainSlice } from '@/redux/store/main-slice';
import { configureStore } from '@reduxjs/toolkit';

const apiSlices = [authApiSlice, sessionApiSlice, userAccountApiSlice];
const storeSlices = [mainSlice];

const store = configureStore({
  reducer: {
    // api
    ...apiSlices.reduce(
      (acc, slice) => ({
        ...acc,
        [slice.reducerPath]: slice.reducer,
      }),
      {}
    ),
    // regular
    ...storeSlices.reduce(
      (acc, slice) => ({
        ...acc,
        [slice.reducerPath]: slice.reducer,
      }),
      {}
    ),
  },
  devTools: config.isDev,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSlices.map(({ middleware }) => middleware)),
});

type RootState = ReturnType<typeof store.getState>;

type Props = {
  children: React.ReactNode;
};

const ReduxStoreWrapper: React.FC<Props> = ({ children }): React.ReactElement => (
  <Provider store={store}>{children}</Provider>
);

export { ReduxStoreWrapper, type RootState, store };
