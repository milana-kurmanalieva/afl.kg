import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { initialSupportState } from '../types/supportSheme';


const name = 'support';

const ENDPOINTS = { TECH_SUPP: `/${apiVersion}/technical_support/` };

const initialState: initialSupportState = {
  techLink: {},
  techLinkStatus: REQUEST_STATUSES.NOT_REQUESTED,
  techLinkError: null,
};


export const getSupport = createAsyncThunk(
  `${name}/getSupportLinks`,
  async (_, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.TECH_SUPP);
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);

export const supportSlice = createSlice({
  name: name,
  initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getSupport, {
      status: 'techLinkStatus',
      data: 'techLink',
      error: 'techLinkError',
    });
  },
});


export const { reducer: supportReducer } = supportSlice;
export const selectSupport = (state: RootState) => state.techSupport;
