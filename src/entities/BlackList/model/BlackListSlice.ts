import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { BlackListType } from '../types/BlackListScheme';


const name = 'blackList';

interface BlackListItem {
  data: {
    id: number;
    description: string;
  }
}

interface InitialStateBlackList {
  blackListData: BlackListItem | null;
  blackListDataError: string | null;
  blackListDataStatus: REQUEST_STATUSES;

  blackListTeamData: BlackListType | null;
  blackListTeamError: string | null;
  blackListTeamStatus: REQUEST_STATUSES;

  blackListPlayersData: BlackListType | null,
  blackListPlayersError: string | null,
  blackListPlayersStatus: REQUEST_STATUSES,
}

const initialState: InitialStateBlackList = {
  blackListData: null,
  blackListDataError: null,
  blackListDataStatus: REQUEST_STATUSES.NOT_REQUESTED,

  blackListTeamData: null,
  blackListTeamError: null,
  blackListTeamStatus: REQUEST_STATUSES.NOT_REQUESTED,

  blackListPlayersData: null,
  blackListPlayersError: null,
  blackListPlayersStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

const ENDPOINTS = {
  GET_BLACK_LIST_CONTENT: (leagueId: number) => `${apiVersion}/leagues/${leagueId}/black_list/`,
  GET_BLACK_LIST_TEAM: (blackListId: number) => `${apiVersion}/black_list/${blackListId}/teams/`,
  GET_BLACK_LIST_PlAYERS: (blackListId: number) => `${apiVersion}/black_list/${blackListId}/players/`,
};

export const getBlackListContent = createAsyncThunk(
  `${name}/getBlackListContent`,
  async ({ leagueId }: { leagueId: number }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_BLACK_LIST_CONTENT(leagueId));
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

export const getBlackListTeam = createAsyncThunk(
  `${name}/getBlackListTeam`,
  async ({ blackListId }: { blackListId: number }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_BLACK_LIST_TEAM(blackListId));
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

export const getBlackListPlayers = createAsyncThunk(
  `${name}/getBlackListPlayers`,
  async ({ blackListId }: { blackListId: number }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_BLACK_LIST_PlAYERS(blackListId));
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

const blackListSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlackListContent.pending, (state) => {
        state.blackListDataStatus = REQUEST_STATUSES.REQUESTED;
      })
      .addCase(getBlackListContent.fulfilled, (state, action) => {
        state.blackListDataStatus = REQUEST_STATUSES.SUCCEEDED;
        state.blackListData = action.payload;
      })
      .addCase(getBlackListContent.rejected, (state, action) => {
        state.blackListDataStatus = REQUEST_STATUSES.FAILED;
        state.blackListDataError = action.error.message || 'Failed to fetch blacklist data';
      })
      .addCase(getBlackListTeam.pending, (state) => {
        state.blackListTeamStatus = REQUEST_STATUSES.REQUESTED;
      })
      .addCase(getBlackListTeam.fulfilled, (state, action) => {
        state.blackListTeamStatus = REQUEST_STATUSES.SUCCEEDED;
        state.blackListTeamData = action.payload;
      })
      .addCase(getBlackListTeam.rejected, (state, action) => {
        state.blackListTeamStatus = REQUEST_STATUSES.FAILED;
        state.blackListTeamError = action.error.message || 'Failed to fetch blacklist team data';
      })
      .addCase(getBlackListPlayers.pending, (state) => {
        state.blackListPlayersStatus = REQUEST_STATUSES.REQUESTED;
      })
      .addCase(getBlackListPlayers.fulfilled, (state, action) => {
        state.blackListPlayersStatus = REQUEST_STATUSES.SUCCEEDED;
        state.blackListPlayersData = action.payload;
      })
      .addCase(getBlackListPlayers.rejected, (state, action) => {
        state.blackListPlayersStatus = REQUEST_STATUSES.FAILED;
        state.blackListPlayersError = action.error.message || 'Failed to fetch blacklist players data';
      });
  },
});

export const { reducer: blackListReducer } = blackListSlice;
export const selectBlackList = (state: RootState) => state.blackList;
