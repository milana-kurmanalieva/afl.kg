import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { AboutUsState } from '../type/aboutUsScheme';


const name = 'aboutUs';

const initialState:AboutUsState = {
  aboutUs: {
    title: '',
    content: '',
  },
  aboutUsError: null,
  aboutUsStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

const ENDPOINTS = { ABOUT_US: `/${apiVersion}/about_us/` };


export const getAboutUs = createAsyncThunk(
  `${name}/getAboutUs`,
  async (_, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.ABOUT_US);
      return response.data;

    } catch (err) {
      return [];
    }
  },
);

export const aboutUsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setAboutUsStatus: (state, action) => {
      state.aboutUsStatus = action.payload;
    },
    resetAboutUs: (state) => {
      state.aboutUs = initialState.aboutUs;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getAboutUs, {
      status: 'aboutUsStatus',
      data: 'aboutUs',
      error: 'aboutUsError',
      options: { concat: true },
    });
  },
});

export const { reducer: aboutUsReducer } = aboutUsSlice;
export const { setAboutUsStatus, resetAboutUs } = aboutUsSlice.actions;
export const selectAboutUs = (state: RootState) => state.aboutUs;
