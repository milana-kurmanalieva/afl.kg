import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { apiVersion, THUNK_ANY } from '@/shared/lib/constants/constants';
import { RootState } from '@/app/providers/StoreProvider';
import { IBestPlayersState } from '../type/bestPlayersSchema';


const name = 'bestPlayers';

const initialState: IBestPlayersState = {
  players: {
    data_tour: '',
    status: '',
    playersError: null,
    players: [],
  },
};


const ENDPOINTS = {
  GET_PLAYERS: (leagueId: number) => {
    return `${apiVersion}/championships/leagues/${leagueId}/tour/best_players/`;
  },
};


export const getPlayers = createAsyncThunk(
  `${name}/getPlayers`,
  async (leagueId: number, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_PLAYERS(leagueId));
      return {
        players: response.data.data,
        data_tour: response.data.tour_date,
        status: response.data.status,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);


export const playersSlice = createSlice({
  name,
  initialState,
  reducers: {
    setBestPlayers: (state, action) => {
      state.players = action.payload;
    },
  },
  extraReducers: (builder) => {
    addQueryCases(builder, getPlayers, {
      status: 'playersStatus',
      data: 'players',
      error: 'playersError',
    });
    builder.addCase(createAction<{ players: IBestPlayersState}>(HYDRATE), (state, action: THUNK_ANY) => {
      return {
        ...state,
        ...action.payload.players,
      };
    });
  },
});


export const { reducer: bestPlayersReducer } = playersSlice;
export const { setBestPlayers } = playersSlice.actions;
export const selectBestPlayers = (state: RootState) => state.bestPlayers;
