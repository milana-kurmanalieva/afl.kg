import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import {
  REQUEST_STATUSES,
  THUNK_ANY,
  apiVersion,
} from '@/shared/lib/constants/constants';
import { championshipsState, getToursParams } from '../type/championshipSchema';


const name = 'championship';

const initialState: championshipsState = {
  championships: [],
  championshipsError: null,
  championshipsStatus: REQUEST_STATUSES.NOT_REQUESTED,

  tours: [],
  toursError: null,
  toursStatus: REQUEST_STATUSES.NOT_REQUESTED,

  currentTour: { id: 0, title: '' },
};

const ENDPOINTS = { GET_TOURS: (divisionId: number) => `/${apiVersion}/championships/division/${divisionId}/tours` };

export const getTours = createAsyncThunk(
  `${name}/getTours`,
  async (params: getToursParams, { dispatch, extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await api.get(ENDPOINTS.GET_TOURS(params.division.id));

      const data = response.data.data.map((item: {id: number; number: number}) => {
        return { title: item.number.toString(), id: item.id };
      });

      dispatch(setCurrentTour({
        title: `${params.division.tour.number} тур`,
        id: params.division.tour.id,
      }));

      return data;

    } catch (err) {
      return [];
    }
  },
);

export const championshipSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setCurrentTour (state, action) {
      state.currentTour = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getTours, {
      status: 'toursStatus',
      data: 'tours',
      error: 'toursError',
    });
  },
});

export const { reducer: championshipReducer } = championshipSlice;
export const { setCurrentTour } = championshipSlice.actions;
export const selectChampionship = (state: RootState) => state.championship;
