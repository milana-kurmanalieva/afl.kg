import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { RootState } from '@/app/providers/StoreProvider';
import { IArchiveGroups, IParamsGroups } from '../types/archiveGroupsScheme';


const name = 'archiveGroups';

const initialState: IArchiveGroups = {
  archiveGroupsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  archiveGroupsList: [],
  archiveCurrentGroup: {
    teams_data: [],
    matches_list: [],
    toursList: [],
  },
  archiveGroupsError: null,
  archiveGroupsTeams: [],
  archiveGroupsMatches: [],
  archiveGroupsRatings: [],
  archiveGroupsBombardiers: [],
};


const ENDPOINTS = {
  GET_GROUPS:
  (cupId?: number): string => `${apiVersion}/archive/cups/${cupId}/groups/`,
  GET_GROUP: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/cup_group/`,
  GET_GROUP_MATHCES: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/cup_matches/`,
  GET_GROUP_RATING: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/cup_players/`,
};

export const getGroupsTeams = createAsyncThunk(
  `${name}/getGroupsTeams`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const superCupParam = params?.super_cup ? `&super_cup=${params.super_cup}` : '';
      const response = await
      api.get(`${ENDPOINTS.GET_GROUP(params?.current_cup)}?group=${params?.group}${superCupParam}`);
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getGroupsRating = createAsyncThunk(
  `${name}/getGroupsRating`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const superCupParam = params?.super_cup ? `&super_cup=${params.super_cup}` : '';
      const response = await api.get(`${ENDPOINTS.GET_GROUP_RATING(params?.current_cup)}?${superCupParam}`);
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getGroupsBombardiers = createAsyncThunk(
  `${name}/getGroupsBombardiers`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const superCupParam = params?.super_cup ? `&super_cup=${params.super_cup}` : '';
      const response = await api.get(`${ENDPOINTS.GET_GROUP_RATING(params?.current_cup)}
      ?${superCupParam}&rating=top_scorers`);
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getGroupsMatches = createAsyncThunk(
  `${name}/getGroupsMatches`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const superCupParam = params?.super_cup ? `&super_cup=${params.super_cup}` : '';
      const url = `${ENDPOINTS.GET_GROUP_MATHCES(params?.current_cup)}?group=${params?.group}&${superCupParam}${
        params.play_off ? `&play_off=${params.play_off}` : ''
      }`;

      const response = await api.get(url);
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getGroups = createAsyncThunk(
  `${name}/getArchiveGroups`,
  async (params: IParamsGroups, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_GROUPS(params?.currentCup));

      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getGroup = createAsyncThunk(
  `${name}/getArchiveGroup`,
  async (params: IParamsGroups, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_GROUP(params?.currentGroup));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const archiveGroupsSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getGroups, {
      status: '',
      data: 'archiveGroupsList',
      error: '',
    });
    addQueryCases(builder, getGroup, {
      status: 'archiveGroupsStatus',
      data: 'archiveCurrentGroup',
      error: 'archiveGroupsStatus',
    });
    addQueryCases(builder, getGroupsTeams, {
      status: 'archiveGroupsTeamsStatus',
      data: 'archiveGroupsTeams',
      error: 'archiveGroupsTeamsError',
    });
    addQueryCases(builder, getGroupsMatches, {
      status: 'archiveGroupsMatchesStatus',
      data: 'archiveGroupsMatches',
      error: 'archiveGroupsMatchesError',
    });
    addQueryCases(builder, getGroupsRating, {
      status: 'archiveGroupsRatingsStatus',
      data: 'archiveGroupsRatings',
      error: 'archiveGroupsRatingsError',
    });
    addQueryCases(builder, getGroupsBombardiers, {
      status: 'archiveGroupsBombardiersStatus',
      data: 'archiveGroupsBombardiers',
      error: 'archiveGroupsBombardiersError',
    });
  },
});


export const { reducer: archiveGroupsReducer } = archiveGroupsSlice;
export const selectArchiveGroups = (state: RootState) => state.archiveGroups;
