import { RootState } from '@/redux';
import { mainSlice } from '@/redux/store/main-slice';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include',
  prepareHeaders: (headers: Headers, { getState }) => {
    const state = getState() as RootState;
    const csrf = state[mainSlice.reducerPath].csrf;
    if (csrf) {
      headers.set(csrf.headerName, csrf.csrfToken);
    }
  },
});

export { baseQuery };
