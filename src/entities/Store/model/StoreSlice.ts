import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import {
  REQUEST_STATUSES,
  THUNK_ANY,
  apiVersion,
} from '@/shared/lib/constants/constants';
import { StoreState } from '../type/storeSchema';


const name = 'stores';

const initialState: StoreState = {
  stores: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  storeProducts: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  storeProductsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  storesCategories: [],
  productsAndShops: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  storesError: null,
  storesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  store: {
    id: '',
    store_logo: { logo: '' },
    title: '',
    description: '',
    delivery: '',
    is_confirmed: false,
    addresses: [],
  },
  storeError: null,
  storeStatus: REQUEST_STATUSES.NOT_REQUESTED,

  storeProductDetail: null,
  storeProductsDetailError: null,
  storeProductsDetailStatus: REQUEST_STATUSES.NOT_REQUESTED,
};

interface queryParamsFields {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  sub_category?: string;
  price_from?: number | string;
  price_to?: number | string;
}

interface queryParamsCategories {
  limit?: number;
  offset?: number;
}

interface queryParamsId {
  id: string;
  limit?: number;
  offset?: number;
}

const ENDPOINTS = {
  STORES: () => `/${apiVersion}/stores/`,
  STORE: (id: string) => `/${apiVersion}/stores/${id}`,
  STORE_PRODUCTS: (id: string) => `/${apiVersion}/stores/${id}/products/`,
  STORES_CATEGORIES: () => `${apiVersion}/stores/categories`,
  STORE_DETAILS: (storeId: string, productId: string) =>
    `${apiVersion}/stores/${storeId}/detail/product/${productId}/`,
};

export const getStores = createAsyncThunk(
  `${name}/getStores`,
  async (
    params?: queryParamsFields,
    { extra: api }: { extra?: THUNK_ANY } = {},
  ) => {
    try {
      const response = await api.get(ENDPOINTS.STORES(), {
        params: {
          limit: params?.limit,
          offset: params?.offset,
          search: params?.search,
          category: params?.category,
          sub_category: params?.sub_category,
          price_from: params?.price_from,
          price_to: params?.price_to,
        },
      });
      return response.data;
    } catch (err) {
      return initialState.stores;
    }
  },
);

export const getStoresBySearch = createAsyncThunk<
  typeof initialState.productsAndShops,
  queryParamsFields,
  { extra: THUNK_ANY }
>(`${name}/getStoresBySearch`, async (params, { extra: api }) => {
  try {
    const response = await api.get(ENDPOINTS.STORES(), {
      params: {
        limit: params?.limit,
        offset: params?.offset,
        search: params?.search,
        category: params?.category,
        sub_category: params?.sub_category,
        price_from: params?.price_from,
        price_to: params?.price_to,
      },
    });
    return response.data;
  } catch (err) {
    return initialState.productsAndShops;
  }
});

export const getStore = createAsyncThunk(
  `${name}/getStore`,
  async (params: queryParamsId, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.STORE(params?.id));
      return response.data;
    } catch (err) {
      return initialState.store;
    }
  },
);

export const getStoreProducts = createAsyncThunk(
  `${name}/getStoreProducts`,
  async (
    params: queryParamsFields & { id: string },
    { extra: api }: THUNK_ANY,
  ) => {
    try {
      const response = await api.get(ENDPOINTS.STORE_PRODUCTS(params.id), { params });
      return response.data;
    } catch (err) {
      return initialState.storeProducts;
    }
  },
);

export const getCategories = createAsyncThunk(
  `${name}/getCategories`,
  async (
    params?: queryParamsCategories,
    { extra: api }: { extra?: THUNK_ANY } = {},
  ) => {
    try {
      const response = await api.get(ENDPOINTS.STORES_CATEGORIES(), params);
      return response.data.results;
    } catch (error) {
      return [];
    }
  },
);

export const getStoreProductDetails = createAsyncThunk(
  `${name}/getStoreProductDetails`,
  async(
    params: { storeId: string, productId: string },
    { extra: api }: {extra?: THUNK_ANY} = {},
  ) => {
    try {
      const response = await api.get(ENDPOINTS.STORE_DETAILS(params.storeId, params.productId));
      return response.data;
    } catch (error) {
      return initialState.storeProductsDetailError;
    }
  },
);

export const storesSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetStoreProducts: (state) => {
      state.storeProducts = initialState.storeProducts;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getStores, {
      status: 'storesStatus',
      data: 'stores',
      error: 'storesError',
      options: { concat: false },
    });
    addQueryCases(builder, getStore, {
      status: 'storeStatus',
      data: 'store',
      error: 'storeError',
    });
    addQueryCases(builder, getStoreProducts, {
      status: 'storeProductsStatus',
      data: 'storeProducts',
      error: 'storeProductsError',
    });
    addQueryCases(builder, getStoresBySearch, {
      status: 'productsAndShopsStatus',
      data: 'productsAndShops',
      error: 'productsAndShopsError',
      options: { concat: false },
    });
    addQueryCases(builder, getCategories, {
      status: 'storesCategoriesStatus',
      data: 'storesCategories',
      error: 'storesCategoriesError',
    });
    addQueryCases(builder, getStoreProductDetails, {
      status: 'storeProductDetailStatus',
      data: 'storeProductDetail',
      error: 'storeProductDetailError',
    });
  },
});

export const { reducer: storesReducer } = storesSlice;
export const { resetStoreProducts } = storesSlice.actions;
export const selectStores = (state: RootState) => {
  return state.stores;
};
export const selectStoreFields = (state: RootState) => state[ name ];
