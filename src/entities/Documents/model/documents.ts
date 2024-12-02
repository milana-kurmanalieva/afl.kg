import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IDocumentsState, IParams } from '../type/documentsSchema';


const name = 'documents';

const initialState: IDocumentsState = {
  documents: [],
  documentsError: null,
  documentsStatus: REQUEST_STATUSES.NOT_REQUESTED,
};


const ENDPOINTS = {
  GET_DOCUMENTS:
  (leagueId: number): string => `${apiVersion}/leagues/${leagueId}/documents/`,
};

export const getDocuments = createAsyncThunk(
  `${name}/getDocuments`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_DOCUMENTS(params.leagueId));
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);


export const documentsSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getDocuments, {
      status: 'documentsStatus',
      data: 'documents',
      error: 'documentsError',
    });
  },
});


export const { reducer: documentsReducer } = documentsSlice;
export const selectDocuments = (state: RootState) => state.documents;
