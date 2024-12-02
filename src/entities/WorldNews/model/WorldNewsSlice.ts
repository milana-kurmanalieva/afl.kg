import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { WorldNewsState } from '../type/worldNewsSchema';


const name = 'worldsNews';

const initialState:WorldNewsState = {
  worldNews: {
    count: 0,
    results: [],
    next: null,
  },
  worldNewsError: null,
  worldNewsStatus: REQUEST_STATUSES.NOT_REQUESTED,

  searchWorldNews: [],
  searchWorldNewsError: null,
  searchWorldNewsStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

const ENDPOINTS = { WORLD_NEWS: `/${apiVersion}/news/world` };

interface queryParams {
  limit?: number;
  offset?:number;
}

export const getWorldsNews = createAsyncThunk(
  `${name}/getWorldsNews`,
  async (params:queryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.WORLD_NEWS, { params });
      return response.data;

    } catch (err) {
      return [];
    }
  },
);

export const getSearchWorldsNews = createAsyncThunk(
  `${name}/getSearchWorldsNews`,
  async (params:queryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.WORLD_NEWS, { params });
      return response.data.results;

    } catch (err) {
      return [];
    }
  },
);

export const worldNewsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetWorldsNews: (state) => {
      state.worldNews = { count: 0, results: [], next: null };
    },
    setWorldNewsStatus: (state, action) => {
      state.worldNewsStatus = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getWorldsNews, {
      status: 'worldNewsStatus',
      data: 'worldNews',
      error: 'worldNewsError',
      options: { concat: true },
    });
    addQueryCases(builder, getSearchWorldsNews, {
      status: 'searchWorldNewsStatus',
      data: 'searchWorldNews',
      error: 'searchWorldNewsError',
    });
  },
});

export const { reducer: worldNewsReducer } = worldNewsSlice;
export const { resetWorldsNews, setWorldNewsStatus } = worldNewsSlice.actions;
export const selectWorldNews = (state: RootState) => state.worldsNews;
