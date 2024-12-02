import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { NewsDetailedState } from '../type/newsDetailedSchema';


const name = 'newsDescription';

const initialState:NewsDetailedState = {
  newsDetailed: null,
  newsDetailedStatus: REQUEST_STATUSES.NOT_REQUESTED,
  newsDetailedError: null,
};

const ENDPOINTS = { NEWS: `/${apiVersion}/news` };
interface queryParams {
  id: number | string;
}

export const getNewsDetailed = createAsyncThunk(
  `${name}/getNewsDescription`,
  async (params:queryParams, { extra: api, rejectWithValue }:THUNK_ANY) => {

    try {
      const response = await api.get(`${ENDPOINTS.NEWS}/${params.id}`, { params });
      return response.data;

    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const newsDetailedSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetNewsDescription: (state) => {
      state.newsDetailed = null;
      state.newsDetailedError = null;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getNewsDetailed, {
      status: 'newsDetailedStatus',
      data: 'newsDetailed',
      error: 'newsDetailedError',
    });
  },
});

export const { reducer: newsDetailedReducer } = newsDetailedSlice;
export const { resetNewsDescription } = newsDetailedSlice.actions;
export const selectNewsDetailed = (state:RootState) => state.newsDetailed;
