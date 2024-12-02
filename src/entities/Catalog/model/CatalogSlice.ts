import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { CatalogState } from '../type/catalogSchema';


const name = 'catalog';

const initialState:CatalogState = {
  catalog: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  catalogError: null,
  catalogStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

const ENDPOINTS = {
  CATALOGS: (type:string, page?: number) => (
    `/${apiVersion}/catalog/${type}/?page=${page}`
  ),
};

interface queryParamsCatalog {
  page?: number;
  type: string;
}


export const getCatalogList = createAsyncThunk(
  `${name}/getCatalogList`,
  async (params:queryParamsCatalog, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.CATALOGS(params.type, params.page), params);
      return response.data;

    } catch (err) {
      return [];
    }
  },
);

export const catalogSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setCatalogStatus: (state, action) => {
      state.catalogStatus = action.payload;
    },
    resetCatalog: (state) => {
      state.catalog = initialState.catalog;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getCatalogList, {
      status: 'catalogStatus',
      data: 'catalog',
      error: 'catalogError',
      options: { concat: true },
    });
    builder.addCase(createAction<{ catalog: CatalogState}>(HYDRATE), (state, action: THUNK_ANY) => {
      if (action.payload.catalog === undefined) return;

      state.catalog = action.payload.catalog.catalog;
      state.catalogStatus = action.payload.catalog.catalogStatus;
    });
  },
});

export const { reducer: catalogReducer } = catalogSlice;
export const { setCatalogStatus, resetCatalog } = catalogSlice.actions;
export const selectCatalog = (state: RootState) => state.catalog;
