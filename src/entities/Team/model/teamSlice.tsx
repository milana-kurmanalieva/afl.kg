import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IInitialState, ITeamData, IParams } from '../type/teamSchema';


const name = 'team';

const ENDPOINTS = {
  TEAM: (id: number | string) => `/${apiVersion}/teams/${id}`,
  PlAYERS: (id: number | string) => `/${apiVersion}/teams/${id}/players/`,
  ARCHIVE_PLAYERS: (id: string | null, champId: string | string[] | undefined) =>
    `/${apiVersion}/archive/championships/${champId}/team/${id}/players`,
  MATCHES: (id: number | string) => `/${apiVersion}/teams/${id}/matches/`,
  NEWS: (id: number | string) => `/${apiVersion}/news/tag/${id}?news_id=${id}`,
  TEAM_RATING: (id: number | string) => `/api/v1/teams/${id}/rating/`,
};

const initialState: IInitialState = {
  teamStatus: REQUEST_STATUSES.NOT_REQUESTED,
  teamData: null,
  teamError: null,

  teamPlayersData: [],
  teamPlayersStatus: REQUEST_STATUSES.NOT_REQUESTED,
  teamPlayersError: null,

  archiveTeamPlayersData: [],
  archiveTeamPlayersStatus: REQUEST_STATUSES.NOT_REQUESTED,
  archiveTeamPlayersError: null,

  teamMatchesData: [],
  teamMatchesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  teamMatchesError: null,

  teamNewsData: [],
  teamNewsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  teamNewsError: null,

  teamRating: [],
  teamRatingError: null,
  teamRatingStatus: REQUEST_STATUSES.NOT_REQUESTED,
};


export const getTeam = createAsyncThunk(
  `${name}/getTeam`,
  async (params: number | string, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.TEAM(params));
      return response.data.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const getTeamPlayers = createAsyncThunk(
  `${name}/getTeamPlayers`,
  async (params: string | number, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.PlAYERS(params));
      return response.data.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const getArchiveTeamPlayers = createAsyncThunk(
  `${name}/getArchiveTeamPlayers`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.ARCHIVE_PLAYERS(params.id, params.champId));
      return response.data.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);


export const getTeamMatches = createAsyncThunk(
  `${name}/getTeamMatches`,
  async ({ matches_by, id }: { matches_by?: string, id: string }, { extra: api }: THUNK_ANY) => {
    try {
      const endpoint = matches_by === 'cup' ?
        ENDPOINTS.MATCHES(id) + `?matches_by=${matches_by}` : ENDPOINTS.MATCHES(id);

      const response = await api.get(endpoint);
      return response.data.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);


export const getTeamNews = createAsyncThunk(
  `${name}/getTeamNews`,
  async (params: number | string, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.NEWS(params));
      return response.data.results;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);


export const getTeamRating = createAsyncThunk(
  `${name}/getTeamRating`,
  async ({ rating, id }: { rating?: string, id: string }, { extra: api }: THUNK_ANY) => {
    try {
      const endpoint = rating === 'cup' ?
        ENDPOINTS.TEAM_RATING(id) + `?rating=${rating}` : ENDPOINTS.TEAM_RATING(id);

      const response = await api.get(endpoint);
      return response.data.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const teamSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setTeamData(state, action) {
      state.teamData = action.payload;
    },
    setTeamStatus(state, action) {
      state.teamData = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getTeam, {
      status: 'teamStatus',
      data: 'teamData',
      error: 'teamsError',
      options: { concat: false },
    });
    addQueryCases(builder, getTeamPlayers, {
      status: 'teamPlayersStatus',
      data: 'teamPlayersData',
      error: 'teamPlayersError',
      options: { concat: false },
    });
    addQueryCases(builder, getArchiveTeamPlayers, {
      status: 'archiveTeamPlayersStatus',
      data: 'archiveTeamPlayersData',
      error: 'archiveTeamPlayersError',
      options: { concat: false },
    });
    addQueryCases(builder, getTeamMatches, {
      status: 'teamMatchesStatus',
      data: 'teamMatchesData',
      error: 'teamMatchesError',
      options: { concat: false },
    });
    addQueryCases(builder, getTeamNews, {
      status: 'teamNewsStatus',
      data: 'teamNewsData',
      error: 'teamNewsError',
      options: { concat: false },
    });
    addQueryCases(builder, getTeamRating, {
      status: 'teamRatingStatus',
      data: 'teamRating',
      error: 'teamRatingError',
      options: { concat: false },
    });
    builder.addCase(createAction<{ teamData: ITeamData }>(HYDRATE), (state, action: any) => {
      if (action.payload) {
        state.teamData = action.payload.team.teamData;

        state.teamPlayersData = action.payload.team.teamPlayersData;

        state.teamMatchesData = action.payload.team.teamMatchesData;

        state.teamNewsData = action.payload.team.teamNewsData;
      }
    });
  },
});

export const { reducer: teamReducer } = teamSlice;
export const { setTeamData, setTeamStatus } = teamSlice.actions;
export const selectTeam = (state: RootState) => state[ name ];
