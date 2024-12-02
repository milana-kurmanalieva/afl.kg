import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IArchiveStage, IParamsStages } from '../types/archivePlayOffScheme';


const name = 'archivePlayOff';

const initialState: IArchiveStage = {
  archiveStagesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  archiveStages: [],
  archiveStage: { matches_list: [] },
  archiveStateError: null,
};


const ENDPOINTS = {
  GET_GROUPS:
  (cupId?: number): string => `${apiVersion}/archive/cups/${cupId}/stages/`,
  GET_GROUP: (stageId?: number) => `${apiVersion}/stage/${stageId}/`,

};

export const getStages = createAsyncThunk(
  `${name}/getArchiveStages`,
  async (params: IParamsStages, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_GROUPS(params?.currentCup));
      const data = response.data.map((item: {name: string, id: number}) => {
        return { title: item.name, id: item.id };
      });

      return data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getStage = createAsyncThunk(
  `${name}/getArchiveStage`,
  async (params: IParamsStages, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_GROUP(params?.currentStage));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const archiveGroupsStages = createSlice({
  name: name,
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getStages, {
      status: 'archiveStagesStatus',
      data: 'archiveStages',
      error: 'archiveStateError',
    });
    addQueryCases(builder, getStage, {
      status: 'archiveStagesStatus',
      data: 'archiveStage',
      error: 'archiveStateError',
    });
  },
});


export const { reducer: archiveGroupsStageReducer } = archiveGroupsStages;
