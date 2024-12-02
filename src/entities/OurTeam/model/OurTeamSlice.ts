import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { OurTeamState } from '../type/ourTeamSchema';


const name = 'ourTeam';

const ENDPOINTS = { OUR_TEAM: (id: number) => `/${apiVersion}/leagues/${id}/management/` };

const initialState: OurTeamState = {
  ourTeamData: [],
  ourTeamStatus: REQUEST_STATUSES.NOT_REQUESTED,
  ourTeamError: null,
};


export const getOurTeam = createAsyncThunk(
  `${name}/getOurTeam`,
  async (params: number, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.OUR_TEAM(params));
      return response.data.results;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const ourTeamSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setOurTeamData(state, action) {
      state.ourTeamData = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getOurTeam, {
      status: 'ourTeamStatus',
      data: 'ourTeamData',
      error: 'ourTeamError',
      options: { concat: false },
    });
  },
});

export const { reducer: ourTeamReducer } = ourTeamSlice;
export const selectOurTeam = (state: RootState) => state.ourTeam;
