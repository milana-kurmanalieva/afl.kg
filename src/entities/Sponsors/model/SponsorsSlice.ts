import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiVersion, REQUEST_STATUSES, THUNK_ANY } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { SponsorsParams, SponsorsState } from '../type/sponsorsSchema';


const name = 'sponsors';

const ENDPOINTS = { SPONSORS: (id: number) => `/${apiVersion}/leagues/${id}/sponsors/` };

const initialState: SponsorsState = {
  sponsorsData: { results: [], next: null, count: 0 },
  sponsorsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  sponsorsError: null,
};

export const getSponsors = createAsyncThunk(
  `${name}/getSponsors`,
  async (params: SponsorsParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.SPONSORS(params.leagueId), { params });
      return response.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const sponsorsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setSponsorsData(state, action) {
      state.sponsorsData = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getSponsors, {
      status: 'sponsorsStatus',
      data: 'sponsorsData',
      error: 'sponsorsError',
      options: { concat: true },
    });
  },
});

export const { reducer: sponsorsReducer } = sponsorsSlice;
export const selectSponsors = (state: RootState) => state.sponsors;
