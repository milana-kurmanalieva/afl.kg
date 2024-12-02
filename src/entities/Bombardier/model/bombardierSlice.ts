import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IBombardierParams, IBombardierState } from '../type/bombardierSchema';


const name = 'bombardier';

const initialState: IBombardierState = {
  bombardier: [],
  bombardierError: null,
  bombardierStatus: REQUEST_STATUSES.NOT_REQUESTED,

  cupBombardiersStatus: REQUEST_STATUSES.NOT_REQUESTED,
  cupBombardiers: [],

  superCupBombardiers: [],
  superCupBombardiersError: null,
  superCupBombardiersStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

const ENDPOINTS = {
  GET_BOMBARDIER: (divisionId: number): string => `${apiVersion}/championships/division/${divisionId}/bombardirs?all=1`,
  GET_CUP_BOMBARDIER: (cupId: number): string => `${apiVersion}/championships/cup/${cupId}/bombardirs?all=1`,
  GET_SUPERCUPS_BOMBARDIER: (cupId: number, isSuperCup: boolean, superCupId: number): string => {
    return `${apiVersion}/cup/${cupId}/bombardirs/${isSuperCup ? `?super_cup=${superCupId}` : ''}`;
  },
};

export const getBombardier = createAsyncThunk(
  `${name}/getBombardier`,
  async (params: IBombardierParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_BOMBARDIER(params.divisionId));
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const getCupBombardier = createAsyncThunk(
  `${name}/getCupBombardier`,
  async (params: { cupId: number; limit?: number; offset?: number }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CUP_BOMBARDIER(params.cupId), { params });
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const getSupercupBombardirs = createAsyncThunk(
  `${name}/getSupercupBombardirs`,
  async (params: { superCupId: number, cupId: number, isSuperCup: boolean }, { extra: api }: THUNK_ANY) => {
    try {
      // eslint-disable-next-line max-len
      const response = await api.get(ENDPOINTS.GET_SUPERCUPS_BOMBARDIER(params.cupId, params.isSuperCup, params.superCupId));
      return response.data.results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const bombardierSlice = createSlice({
  name,
  initialState,
  reducers: {
    setBombardierStatus(state, action) {
      state.bombardierStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    addQueryCases(builder, getBombardier, {
      status: 'bombardierStatus',
      data: 'bombardier',
      error: 'bombardierError',
    });
    addQueryCases(builder, getCupBombardier, {
      status: 'cupBombardiersStatus',
      data: 'cupBombardiers',
      error: 'cupBombardiersError',
    });
    addQueryCases(builder, getSupercupBombardirs, {
      status: 'superCupBombardiersStatus',
      data: 'superCupBombardiers',
      error: 'superCupBombardiersError',
    });
    builder.addCase(createAction<{ bombardier: IBombardierState }>(HYDRATE), (state, action) => {
      return {
        ...state,
        ...action.payload.bombardier,
      };
    });
  },
});

export const { reducer: bombardierReducer } = bombardierSlice;
export const { setBombardierStatus } = bombardierSlice.actions;
export const selectBombardier = (state: RootState) => state.bombardier;
