import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiVersion, THUNK_ANY } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { IParams, IWinners } from '../type/WinnersSchema';


const name = 'winners';

const initialState: IWinners = {
  data: [],
  status: '',
  divisionSelect: null,
  winnerTeams: [],
};


const ENDPOINTS = {
  GET_DIVISIONS: (leagueId: number) => {
    return `/${apiVersion}/championships/leagues/${leagueId}/last_champ/divizion/list/`;
  },
  GET_WINNERS: (leagueId: number, divisionId: number) => {
    return `/${apiVersion}/championships/leagues/${leagueId}/last_champ/best_teams/?original_division_id=${divisionId}`;
  },
};

export const getWinners = createAsyncThunk(
  `${name}/getWinners`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_DIVISIONS(params));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getWinnerTeams = createAsyncThunk(
  `${name}/getWinnerTeams`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_WINNERS(params.leagueId, params.divisionId));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const winnersSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setWinners: (state, action) => {
      state.data = action.payload;
    },
    setDivisionSelect: (state, action) => {
      state.divisionSelect = action.payload;
    },
    setWinnersTeams: (state, action) => {
      state.winnerTeams = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getWinners, {
      status: 'status',
      data: 'data',
      error: 'error',
    });

    addQueryCases(builder, getWinnerTeams, {
      status: 'status',
      data: 'winnerTeams',
      error: 'error',
    });
  },
});


export const { reducer: winnersReducer } = winnersSlice;
export const { setWinners, setDivisionSelect, setWinnersTeams } = winnersSlice.actions;
export const selectWinners = (state: RootState) => state.winners;
