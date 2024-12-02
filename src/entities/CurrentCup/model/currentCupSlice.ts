/* eslint-disable max-len */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { ISuperCupResponse, REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { CurrentCupState, IParams } from '../type/currentCupSchema';


const name = 'currentCup';

const initialState: CurrentCupState = {
  currentCup: null,
  currentCupError: null,
  currentCupStatus: REQUEST_STATUSES.NOT_REQUESTED,

  cup_now: null,

  currentCupGroups: [],
  currentCupGroupsError: null,
  currentCupGroupsStatus: REQUEST_STATUSES.NOT_REQUESTED,

  currentGroup: null,

  currentCupStages: [],
  currentCupStagesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  currentCupStagesError: null,
  currentStage: null,

  superCupData: null,
  superCupDataStatus: REQUEST_STATUSES.NOT_REQUESTED,
  superCupDataError: null,

  groupCupData: {
    teams_data: [],
    matches_list: [],
  },
  groupCupDataStatus: REQUEST_STATUSES.NOT_REQUESTED,
  groupCupDataError: null,

  stageCupData: { matches_list: [] },
  stageCupDataStatus: REQUEST_STATUSES.NOT_REQUESTED,
  stageCupDataError: null,
};


const ENDPOINTS = {
  GET_CURRENT_CUP: (leagueId: number): string => `${apiVersion}/leagues/${leagueId}/current_cup/`,
  GET_CURRENT_CUP_GROUPS: (leagueId: number): string => `${apiVersion}/leagues/${leagueId}/current_cup/groups/`,
  GET_CURRENT_CUP_STAGES: (leagueId: number): string => `${apiVersion}/leagues/${leagueId}/current_cup/stages/`,
  GET_IS_OVER_CUP: (leagueId: number): string => `${apiVersion}/leagues/${leagueId}/cup_status/`,
  GET_CURRENT_SUPER_CUP: (): string => `${apiVersion}/leagues/1/current_cup/super_cup`,
  GET_SUPER_CUP_GROUP: (groupId: number, superCupId: number, isSuperCup: boolean): string => `${apiVersion}/group/${groupId}/${isSuperCup ? `?super_cup=${superCupId}` : ''}`,
  GET_SUPER_CUP_STAGE: (stageId: number, superCupId: number, isSuperCup: boolean): string => `${apiVersion}/stage/${stageId}/${isSuperCup ? `?super_cup=${superCupId}` : ''}`,
};

export const getSuperCupStageData = createAsyncThunk(
  `${name}/getSuperCupStageData`,
  async ({ stageId, superCupId, isSuperCup }: { stageId: number; superCupId: number, isSuperCup: boolean }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_SUPER_CUP_STAGE(stageId, superCupId, isSuperCup));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getSuperCupGroupData = createAsyncThunk(
  `${name}/getSuperCupGroupDataaa`,
  async ({ groupId, superCupId, isSuperCup }: { groupId: number; superCupId: number, isSuperCup: boolean }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_SUPER_CUP_GROUP(groupId, superCupId, isSuperCup));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getCurrentSuperCup = createAsyncThunk(
  `${name}/getCurrentSuperCup`,
  async (_, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CURRENT_SUPER_CUP());
      const data = response.data;

      const transformedResults = data.results.map((item: { format: number; title: string }, index: number) => ({
        value: index,
        id: item.format,
        label: item.title,
      }));
      return {
        ...data,
        results: transformedResults,
      } as ISuperCupResponse;

    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const getCurrentCupDescription = createAsyncThunk(
  `${name}/getCurrentCupDescription`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CURRENT_CUP(params.leagueId));
      return response.data;

    } catch (error) {
      console.error(error);
    }
  },
);

export const getIsOverCup = createAsyncThunk(
  `${name}/getIsOverCup`,
  async (leagueId: number, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_IS_OVER_CUP(leagueId));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getCurrentCupGroups = createAsyncThunk(
  `${name}/getCurrentCupGroups`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CURRENT_CUP_GROUPS(params.leagueId));
      return response.data;

    } catch (error) {
      console.error(error);
    }
  },
);

export const getCurrentCupStages = createAsyncThunk(
  `${name}/getCurrentCupStages`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CURRENT_CUP_STAGES(params.leagueId));

      if (Array.isArray(response.data)) return response.data?.map((stage: { name: string, id: number }) =>
        ({ title: stage.name, id: stage.id }),
      );

      return [];

    } catch (error) {
      console.error(error);
    }
  },
);


export const currentCupSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setCurrentGroup(state, action) {
      state.currentGroup = action.payload;
    },
    setCurrentStage(state, action) {
      state.currentStage = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getSuperCupStageData, {
      status: 'stageCupDataStatus',
      data: 'stageCupData',
      error: 'stageCupDataError',
    });
    addQueryCases(builder, getSuperCupGroupData, {
      status: 'groupCupDataStatus',
      data: 'groupCupData',
      error: 'groupCupDataError',
    });
    addQueryCases(builder, getCurrentSuperCup, {
      status: 'superCupDataStatus',
      data: 'superCupData',
      error: 'superCupDataError',
    });
    addQueryCases(builder, getCurrentCupDescription, {
      status: 'currentCupStatus',
      data: 'currentCup',
      error: 'currentCupError',
    });
    addQueryCases(builder, getIsOverCup, {
      status: 'cupIsOverStatus',
      data: 'cupIsOver',
      error: 'cupIsOverError',
    });
    addQueryCases(builder, getCurrentCupGroups, {
      status: 'currentCupGroupsStatus',
      data: 'currentCupGroups',
      error: 'currentCupGroupsError',
    });
    addQueryCases(builder, getCurrentCupStages, {
      status: 'currentCupGroupsStatus',
      data: 'currentCupStages',
      error: 'currentCupStagesError',
    });
  },
});


export const { reducer: currentCupReducer } = currentCupSlice;
export const { setCurrentGroup, setCurrentStage } = currentCupSlice.actions;
export const selectCurrentCup = (state: RootState) => state.currentCup;
