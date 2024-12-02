import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { ShopData, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { MyShopState } from '../types/myShopsSchema';


const name = 'myShop';

const initialState: MyShopState = { myShops: [], myShop: null };


const ENDPOINTS = {
  MY_SHOPS: `${apiVersion}/profile/stores/`,
  MY_SHOP: (store_uuid: string) => `${apiVersion}/profile/stores/${store_uuid}/`,
  MY_SHOP_LOGO: (store_uuid: string) => `${apiVersion}/profile/stores/${store_uuid}/logo_create/`,
};

export const getMyShops = createAsyncThunk(
  `${name}/getMyShops`,
  async (params: {limit?: number, offset?: number}, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.MY_SHOPS, { params });
      return response.data.results;
    } catch (error) {

    }
  },
);

export const getMyShop = createAsyncThunk(
  `${name}/getMyShop`,
  async (params: {shop_id: string}, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.MY_SHOP(params.shop_id));
      return response.data;
    } catch (error) {

    }
  },
);
export const deleteMySHop = createAsyncThunk(
  `${name}/deleteMySHop`,
  async (params: {shop_id: string}, { extra: api }: THUNK_ANY) => {
    try {
      await api.delete(ENDPOINTS.MY_SHOP(params.shop_id));
      return null;
    } catch (error) {
      return null;
    }
  },
);

export const createShop = createAsyncThunk(
  `${name}/createShop`,
  async (payload: ShopData, { extra: api }: THUNK_ANY) => {
    try {
      const res = await api.post(ENDPOINTS.MY_SHOPS, payload);
      return res.data;
    } catch (error) {
      return error;
    }
  },
);

export const updateShop = createAsyncThunk(
  `${name}/updateShop`,
  async (payload: {shop_id: string, data: ShopData}, { extra: api }: THUNK_ANY) => {
    try {
      const res = await api.patch(ENDPOINTS.MY_SHOP(payload.shop_id), payload.data);
      return res.data;
    } catch (error) {
      return error;
    }
  },
);

export const createShopLogo = createAsyncThunk(
  `${name}/createShop`,
  async (payload: {shop_uuid: string, logo: File}, { extra: api }: THUNK_ANY) => {
    try {
      const data = new FormData();
      data.append('logo', payload.logo);

      await api.post(ENDPOINTS.MY_SHOP_LOGO(payload.shop_uuid), data);
    } catch (error) {
      return error;
    }
  },
);

export const myShopSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getMyShops, {
      status: '',
      data: 'myShops',
      error: '',
    });
    addQueryCases(builder, getMyShop, {
      status: '',
      data: 'myShop',
      error: '',
    });
    addQueryCases(builder, deleteMySHop, {
      status: '',
      data: 'myShop',
      error: '',
    });
  },
});


export const { reducer: myShopReducer } = myShopSlice;
export const { } = myShopSlice.actions;
export const selectMyShop = (state: RootState) => state.myShop;
