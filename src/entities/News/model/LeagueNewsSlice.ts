import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { LeagueNewsState } from '../type/newsSchema';


const name = 'leaguesNews';

const initialState:LeagueNewsState = {
  leagueNews: {
    count: 0,
    results: [],
    next: null,
  },
  leagueNewsError: null,
  leagueNewsStatus: REQUEST_STATUSES.NOT_REQUESTED,

  leagueNewsByTag: [],
  leagueNewsByTagError: null,
  leagueNewsByTagStatus: REQUEST_STATUSES.NOT_REQUESTED,

  searchNews: [],
  searchNewsError: null,
  searchNewsStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

const ENDPOINTS = {
  LEAGUE_NEWS: (leagueId: number) => (
    `/${apiVersion}/news/league/${leagueId}?category=1`
  ),
  BY_TAG_NEWS: (tagId: number, news_id?: number | string) => (
    `/${apiVersion}/news/tag/${tagId}?news_id=${news_id ? news_id : ''}`
  ),
};

interface queryParams {
  limit?: number;
  offset?:number;
  id?: number;
  search?: string;
  leagueId: number;
  news_id?: number;
  tagId?: number;
}

export const getLeaguesNews = createAsyncThunk(
  `${name}/getLeaguesNews`,
  async (params:queryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.LEAGUE_NEWS(params.leagueId), { params });
      return response.data;

    } catch (err) {
      return [];
    }
  },
);

interface queryParamsNewsByTag {
  limit?: number;
  offset?:number;
  news_id?: number | string;
  tagId: number;
}

export const getLeaguesNewsByTag = createAsyncThunk(
  `${name}/getLeaguesNewsByTag`,
  async (params:queryParamsNewsByTag, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.BY_TAG_NEWS(params.tagId, params.news_id), { params });
      return response.data.results;

    } catch (err) {
      return [];
    }
  },
);

interface queryParamsSearchNews {
  limit?: number;
  offset?:number;
  search: string;
  leagueId: number;
}

export const getSearchNews = createAsyncThunk(
  `${name}/getSearchNews`,
  async (params:queryParamsSearchNews, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.LEAGUE_NEWS(params.leagueId), { params });
      return response.data.results;

    } catch (err) {
      return [];
    }
  },
);

export const leagueNewsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetLeaguesNewsByTag: (state) => {
      state.leagueNewsByTag = [];
    },
    setLeagueNewsStatus: (state, action) => {
      state.leagueNewsStatus = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getLeaguesNews, {
      status: 'leagueNewsStatus',
      data: 'leagueNews',
      error: 'leagueNewsError',
      options: { concat: true },
    });
    addQueryCases(builder, getLeaguesNewsByTag, {
      status: 'leagueNewsByTagStatus',
      data: 'leagueNewsByTag',
      error: 'leagueNewsByTagError',
    });
    addQueryCases(builder, getSearchNews, {
      status: 'searchNewsStatus',
      data: 'searchNews',
      error: 'searchNewsError',
    });
    builder.addCase(createAction<{ leagueNews: LeagueNewsState}>(HYDRATE), (state, action: THUNK_ANY) => {
      if (action.payload.leagueNews === undefined) return;

      state.leagueNews = action.payload.leagueNews.leagueNews;
      state.leagueNewsStatus = action.payload.leagueNews.leagueNewsStatus;
    });
  },
});

export const { reducer: leagueNewsReducer } = leagueNewsSlice;
export const { resetLeaguesNewsByTag, setLeagueNewsStatus } = leagueNewsSlice.actions;
export const selectLeagueNews = (state: RootState) => state.leaguesNews;
