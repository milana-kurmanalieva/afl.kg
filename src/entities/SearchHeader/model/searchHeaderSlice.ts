import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IParamsSearch, ISearchHeaderSchema } from '../type/searchHeaderSchema';


const name = 'searchHeader';
const ENDPOINTS = { SEARCH: (leagueId: number) => `/${apiVersion}/leagues/${leagueId}/search` };
const initialState : ISearchHeaderSchema = { response: [], searchValue: '', displayResults: [] };

export const getSearch = createAsyncThunk(
  `${name}/getSearch`,
  async (params: IParamsSearch, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.SEARCH(params.leagueId), { params });

      return response.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);


export const searchHeaderSlice = createSlice({
  name: 'searchHeader',
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setDisplayResults: (state) => {
      state.displayResults = state.response;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getSearch, {
      status: '',
      data: 'response',
      error: '',
    });
  },
});

export const { actions: searchHeaderSliceActions } = searchHeaderSlice;
export const { reducer: searchHeaderSliceReducer } = searchHeaderSlice;
export const { setSearchValue, setDisplayResults } = searchHeaderSlice.actions;
export const selectSearchHeader = (state: RootState) => state.searchHeader;
