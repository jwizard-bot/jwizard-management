import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { CsrfResDto } from '@/redux/api/session/type';
import { LoggedUser } from '@/redux/api/type';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type MainSliceInitialState = {
  loggedUser: LoggedUser | null;
  requireMfa: boolean;
  mfaRecoveryMode: boolean;
  initialized: boolean;
  csrf: CsrfResDto | null;
  dashboardDrawerOpen: boolean;
  skippedChangeDefaultPassword: boolean;
};

const initialState: MainSliceInitialState = {
  loggedUser: null,
  requireMfa: false,
  mfaRecoveryMode: false,
  initialized: false,
  csrf: null,
  dashboardDrawerOpen: true,
  skippedChangeDefaultPassword: false,
};

const mainSlice = createSlice({
  name: 'mainSlice',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setRequireMfa: (state, action: PayloadAction<boolean>) => {
      state.requireMfa = action.payload;
    },
    setMfaRecoveryMode: (state, action: PayloadAction<boolean>) => {
      state.mfaRecoveryMode = action.payload;
    },
    setLoggedUser: (state, action: PayloadAction<LoggedUser | null>) => {
      state.loggedUser = action.payload;
    },
    setDefaultPasswordState: (state, action: PayloadAction<boolean>) => {
      if (state.loggedUser) {
        state.loggedUser.hasDefaultPassword = action.payload;
      }
    },
    setCsrf: (state, action: PayloadAction<CsrfResDto | null>) => {
      state.csrf = action.payload;
    },
    setDashboardDrawerState: (state, action: PayloadAction<boolean>) => {
      state.dashboardDrawerOpen = action.payload;
    },
    toggleDashboardDrawerState: state => {
      state.dashboardDrawerOpen = !state.dashboardDrawerOpen;
    },
    setSkippedChangeDefaultPassword: (state, action: PayloadAction<boolean>) => {
      state.skippedChangeDefaultPassword = action.payload;
    },
  },
});

const useMainSlice = () => useSelector((state: RootState) => state[mainSlice.reducerPath]);

export const {
  setInitialized,
  setRequireMfa,
  setMfaRecoveryMode,
  setLoggedUser,
  setDefaultPasswordState,
  setCsrf,
  setDashboardDrawerState,
  toggleDashboardDrawerState,
  setSkippedChangeDefaultPassword,
} = mainSlice.actions;

export { type MainSliceInitialState, mainSlice, useMainSlice };
