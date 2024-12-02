import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IParams, IPlayersState } from '../type/playersSchema';


const name = 'players';

const ENDPOINTS = { players: (leagueId: number) => `/${apiVersion}/leagues/${leagueId}/players/` };
const initialState: IPlayersState = {
  playersResponse: {
    next: null,
    previous: null,
    count: 0,
    results: [],
  },
  playersStatus: REQUEST_STATUSES.NOT_REQUESTED,
  playersError: null,

  playersList: [],
  playersListStatus: REQUEST_STATUSES.NOT_REQUESTED,
  playersListError: null,
};

export const getPlayersInfinity = createAsyncThunk(
  `${name}/getPlayersInfinity`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.players(params.leagueId), { params });

      return response.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const getPlayers = createAsyncThunk(
  `${name}/getPlayers`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.players(params.leagueId), { params });

      return response.data?.results;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);


export const playersSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetPlayers: (state) => {
      state.playersResponse = initialState.playersResponse;
    },
    resetSearchedPlayers: (state) => {
      state.playersList = [];
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getPlayersInfinity, {
      status: 'playersStatus',
      data: 'playersResponse',
      error: 'playersError',
      options: { concat: true },
    });
    addQueryCases(builder, getPlayers, {
      status: 'playersListStatus',
      data: 'playersList',
      error: 'playersListError',
    });
  },
});

export const { resetPlayers, resetSearchedPlayers } = playersSlice.actions;
export const { reducer: playersReducer } = playersSlice;
export const selectPlayers = (state: RootState) => state.players;
