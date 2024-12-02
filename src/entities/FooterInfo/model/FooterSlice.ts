import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';


const name = 'footer';

interface IAddress {
  address?: string,
  url?: string
}

interface InitialFooterStateInterface {
  footerInfo: { phone_numbers: [], addresses: IAddress[], medias: [] },
  footerInfoStatus: REQUEST_STATUSES.NOT_REQUESTED,
  footerInfoError: null,
}

const ENDPOINTS = { footer: (leagueId: number) => `/${apiVersion}/leagues/${leagueId}/footer/` };
const initialState: InitialFooterStateInterface = {
  footerInfo: { phone_numbers: [], addresses: [], medias: [] },
  footerInfoStatus: REQUEST_STATUSES.NOT_REQUESTED,
  footerInfoError: null,
};

export const getFooterInfo = createAsyncThunk(
  `${name}/getFooterInfo`,
  async (params: {leagueId: number}, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.footer(params.leagueId), { params });
      return response.data;
    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const footerSlice = createSlice({
  name: name,
  initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getFooterInfo, {
      status: 'footerInfoStatus',
      data: 'footerInfo',
      error: 'footerInfoError',
    });
  },
});

export const { reducer: footerReducer } = footerSlice;
export const selectFooter = (state: RootState) => state.footer;
