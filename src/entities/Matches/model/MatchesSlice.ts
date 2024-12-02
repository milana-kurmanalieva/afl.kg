import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiVersion, REQUEST_STATUSES, THUNK_ANY } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { MatchesState } from '../type/MatchSchema';


const name = 'matches';

const ENDPOINTS = {
  MATCHES: (id: number) => `/${apiVersion}/archive/match/${id}`,
  CUP: (id: number) => `/${apiVersion}/archive/cupmatch/${id}`,
  MATCHES_ADDITIONAL: (matchId: number) => `${apiVersion}/championships/match/${matchId}/matches/`,
  PHOTO_ALBUM: (id: number) => `${apiVersion}/championships/match/${id}/albums/`,
  VIDEO_ALBUM: (id: number) => `${apiVersion}/championships/match/${id}/videos/`,
};

const initialState: MatchesState = {
  matchData: [],
  matchStatus: REQUEST_STATUSES.NOT_REQUESTED,
  matchError: null,

  cupData: [],
  cupStatus: REQUEST_STATUSES.NOT_REQUESTED,
  cupError: null,

  matchesAdditional: [],
  matchesError: null,

  photoAlbums: [],
  photoError: null,
  videoAlbums: [],
  videoError: null,
};

export const getMatches = createAsyncThunk(
  `${name}/getMatches`,
  async (matchId: number, { extra: api }: {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.MATCHES(matchId));
      return [ response.data.data ];
    }
    catch (err) {
      console.error(err);
      return [];
    }
  },
);


export const getCupMatches = createAsyncThunk(
  `${name}/getCupMatches`,
  async (matchId: number, { extra: api }: {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.CUP(matchId));

      return [ response.data.data ];
    }
    catch (err) {
      console.error(err);
      return [];
    }
  },
);

export const getMatchesAdditional = createAsyncThunk(
  `${name}/getMatchesAdditional`,
  async (matchId: number, { extra: api }: {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.MATCHES_ADDITIONAL(matchId));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getPhotoAlbum = createAsyncThunk(
  `${name}/getPhotoAlbum`,
  async (matchId: number, { extra: api }: {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.PHOTO_ALBUM(matchId));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getVideoAlbum = createAsyncThunk(
  `${name}/getVideoAlbum`,
  async (matchId: number, { extra: api } : {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.VIDEO_ALBUM(matchId));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);


export const matchSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setMatchData(state, action) {
      state.matchData = action.payload;
    },
    setCupData(state, action) {
      state.cupData = action.payload;
    },
    setMatchesAdditional(state, action) {
      state.matchesAdditional = action.payload;
    },
    setPhotoAlbums(state, action) {
      state.photoAlbums = action.payload;
    },
    setVideoAlbums(state, action) {
      state.videoAlbums = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getMatches, {
      status: 'matchStatus',
      data: 'matchData',
      error: 'matchError',
      options: { concat: false },
    });
    addQueryCases(builder, getCupMatches, {
      status: 'cupStatus',
      data: 'cupData',
      error: 'cupError',
      options: { concat: false },
    });
    addQueryCases(builder, getMatchesAdditional, {
      status: 'matchStatus',
      data: 'matchesAdditional',
      error: 'matchesError',
    });
    addQueryCases(builder, getPhotoAlbum, {
      status: 'matchStatus',
      data: 'photoAlbums',
      error: 'photoError',
    });
    addQueryCases(builder, getVideoAlbum, {
      status: 'matchStatus',
      data: 'videoAlbums',
      error: 'videoError',
    });
  },
});


export const { reducer: matchesReducer } = matchSlice;
export const selectMatches = (state: RootState) => state.matches;
