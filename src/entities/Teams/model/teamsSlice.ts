import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { ITeam } from '@/shared/ui/Teams/TeamsList/TeamsList';
// eslint-disable-next-line import/namespace
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { IParams, ITeamsState } from '../type/teamsSchema';


const name = 'teams';

const ENDPOINTS = { TEAMS: (leagueId: number) => `/${apiVersion}/leagues/${leagueId}/teams/` };
const initialState: ITeamsState = {
  teamsResponse: {
    next: null,
    previous: null,
    count: 0,
    results: [],
  },
  teamsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  teamsError: null,

  teamsList: [],
  teamsListStatus: REQUEST_STATUSES.NOT_REQUESTED,
  teamsListError: null,
};

export const getTeamsInfinity = createAsyncThunk(
  `${name}/getTeamsInfinity`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.TEAMS(params.leagueId), { params });

      return response.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const getTeams = createAsyncThunk(
  `${name}/getTeams`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.TEAMS(params.leagueId), { params });

      return response.data?.results;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);


export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    resetTeams: (state) => {
      state.teamsResponse = initialState.teamsResponse;
    },
    resetSearchedTeams: (state) => {
      state.teamsList = [];
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getTeamsInfinity, {
      status: 'teamsStatus',
      data: 'teamsResponse',
      error: 'teamsError',
      options: { concat: true },
    });
    addQueryCases(builder, getTeams, {
      status: 'teamsListStatus',
      data: 'teamsList',
      error: 'teamsListError',
    });
    builder.addCase(createAction<{ teamsList: ITeam[] }>(HYDRATE), (state, action: any) => {
      if (!action.payload) return;
      state.teamsList = action.payload.teams.teamsList;
    });
  },
});

export const { resetTeams, resetSearchedTeams } = teamsSlice.actions;
export const { reducer: teamsReducer } = teamsSlice;
export const selectTeams = (state: RootState) => state.teams;
