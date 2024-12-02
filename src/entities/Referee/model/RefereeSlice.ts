import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { RefereeState } from '../type/refereeSchema';


const name = 'referee';

const ENDPOINTS = { REFEREE: (id: number) => `/${apiVersion}/leagues/${id}/judges/` };

const initialState: RefereeState = {
  refereeData: [],
  refereeStatus: REQUEST_STATUSES.NOT_REQUESTED,
  refereeError: null,
};


export const getReferee = createAsyncThunk(
  `${name}/getReferee`,
  async (params: number, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.REFEREE(params));
      return response.data.results;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const refereeSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setRefereeData(state, action) {
      state.refereeData = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getReferee, {
      status: 'refereeStatus',
      data: 'refereeData',
      error: 'refereeError',
      options: { concat: false },
    });
  },
});

export const { reducer: refereeReducer } = refereeSlice;
export const selectReferee = (state: RootState) => state.referee;
