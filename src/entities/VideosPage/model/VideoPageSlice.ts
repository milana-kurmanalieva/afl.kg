import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { DivisionOption } from '@/entities/Divisions/type/divisionSchema';
import { LeagueVideosState } from '../type/VideoSchema';


const name = 'leaguesVideos';

const initialState:LeagueVideosState = {
  leagueVideos: {
    count: 0,
    results: [],
    next: null,
  },
  leagueVideosError: null,
  leagueVideosStatus: REQUEST_STATUSES.NOT_REQUESTED,
  liveVideos: [],

  mainVideos: [],
};

const ENDPOINTS = {
  LEAGUE_VIDEOS: (leagueId: number | string, leagueSquare: string) => (
    `/${apiVersion}/leagues/${leagueId}/videos/${leagueSquare}`
  ),
  MAIN_VIDEOS: (leagueId: number) => `/${apiVersion}/main_page/league/${leagueId}/videos`,
};

export interface LeagueVideosQueryParams {
  leagueId: number | string;
  leagueSquare: string;
  limit?: number;
  offset?: number;
  page?: number;
}

export const getMainVideos = createAsyncThunk(
  `${name}/getMainVideos`,
  async (params: {limit?: number, leagueId: number}, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.MAIN_VIDEOS(params.leagueId), { params });
      return response.data.results;

    } catch (err) {
      return [];
    }
  },
);

export const getLeaguesVideos = createAsyncThunk(
  `${name}/getLeaguesVideos`,
  async (params:LeagueVideosQueryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await api.get(ENDPOINTS.LEAGUE_VIDEOS(
        params.leagueId, params.leagueSquare,
      ), { params });
      return response.data;

    } catch (err) {
      return [];
    }
  },
);

interface liveParams {leagueId: number, divisions: DivisionOption[]}

export const getLiveVideos = createAsyncThunk(
  `${name}/getLiveVideos`,
  async ({ leagueId, divisions }: liveParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {

    try {
      const response = await Promise.all(divisions.map((division: DivisionOption) => (
        api.get(ENDPOINTS.LEAGUE_VIDEOS(leagueId, division.id.toString()))
      )));

      const result = [];

      for (const res of response) {
        if (result.length === 2) return result;
        const resVideo = res.data.results[ 0 ];
        if (resVideo) result.push(resVideo);
      }

      return result;

    } catch (err) {
      return [];
    }
  },
);


export const leagueVideosSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setLeagueVideosStatus: (state, action) => {
      state.leagueVideosStatus = action.payload;
    },
    resetVideos: (state) => {
      state.leagueVideos = initialState.leagueVideos;
    },
    setLiveVideos: (state, action) => {
      state.liveVideos = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getLeaguesVideos, {
      status: 'leagueVideosStatus',
      data: 'leagueVideos',
      error: 'leagueVideosError',
      options: { concat: true },
    });
    addQueryCases(builder, getLiveVideos, {
      status: '',
      data: 'liveVideos',
      error: '',
    });
    addQueryCases(builder, getMainVideos, {
      status: '',
      data: 'mainVideos',
      error: '',
    });
    builder.addCase(createAction<{ leagueVideos: LeagueVideosState}>(HYDRATE), (state, action: THUNK_ANY) => {
      if (action.payload.leagueVideos === undefined) return;

      state.leagueVideos = action.payload.leagueVideos.leagueVideos;
      state.leagueVideosStatus = action.payload.leagueVideos.leagueVideosStatus;
    });
  },
});

export const { reducer: leagueVideosReducer } = leagueVideosSlice;
export const { setLeagueVideosStatus, resetVideos, setLiveVideos } = leagueVideosSlice.actions;
export const selectLeagueVideos = (state: RootState) => state.leaguesVideos;
