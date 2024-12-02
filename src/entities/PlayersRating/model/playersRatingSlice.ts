import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { apiVersion, REQUEST_STATUSES, THUNK_ANY } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { IParamsRating, IPlayersRating } from '../type/playerRatingScheme';


const name = 'playersRating';


const ENDPOINTS = {
  GET_PLAYERS_RATING:
  (divisionId: number): string => `${apiVersion}/championships/division/${divisionId}/rating?all=1`,
  GET_CUP_PLAYERS_RATING:
  (cupId: number): string => `${apiVersion}/championships/cup/${cupId}/rating`,
};

const initialState: IPlayersRating = {
  playersRating: [],
  playersRatingError: null,
  playersRatingStatus: REQUEST_STATUSES.NOT_REQUESTED,

  cupPlayersRating: [],
  cupPlayersRatingStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

export const getPlayersRating = createAsyncThunk(
  `${name}/getPlayersRating`,
  async (params: IParamsRating, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_PLAYERS_RATING(params.divisionId));
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);

export const getCupPlayersRating = createAsyncThunk(
  `${name}/getCupPlayersRating`,
  async (params: {cupId: number}, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CUP_PLAYERS_RATING(params.cupId));
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);


export const playersRatingSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setPlayersRatingStatus(state, action) {
      state.playersRatingStatus = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getPlayersRating, {
      status: 'playersRatingStatus',
      data: 'playersRating',
      error: 'playersRatingError',
    });
    addQueryCases(builder, getCupPlayersRating, {
      status: 'cupPlayersRatingStatus',
      data: 'cupPlayersRating',
      error: '',
    });
    builder.addCase(createAction<{ playersRating: IPlayersRating}>(HYDRATE), (state, action: any) => {
      state.playersRating = action.payload.playersRating.playersRating;
      state.playersRatingStatus = action.payload.playersRating.playersRating;

    });
  },
});


export const { reducer: playersRatingReducer } = playersRatingSlice;
export const { setPlayersRatingStatus } = playersRatingSlice.actions;
export const selectPlayersRating = (state: RootState) => state.playersRating;
