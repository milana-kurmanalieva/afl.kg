import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import {
  ShopData,
  THUNK_ANY,
  apiVersion,
} from '@/shared/lib/constants/constants';
import {
  MyProductsState,
  SimilarProductsQuery,
} from '../types/myProductsSchema';


const name = 'myProducts';

const initialState: MyProductsState = {
  myProductsRecord: {},
  categories: [],
  product: null,
  similarProducts: [],
};

const ENDPOINTS = {
  MY_PRODUCTS: `${apiVersion}/profile/owner_stores/`,
  MY_PRODUCT: (product_id: string) =>
    `${apiVersion}/profile/stores/products/${product_id}/`,
  MY_PRODUCTS_FROM_SHOP: `${apiVersion}/profile/stores/products/`,
  MY_PRODUCTS_DETAIL: (product_id: string) =>
    `${apiVersion}/profile/stores/products/${product_id}`,
  MY_PRODUCTS_DELETE: (product_id: string) =>
    `${apiVersion}/profile/stores/delete/products/${product_id}`,
  MY_SIMILAR_PRODUCTS: (store_id: string, category_slug: string) =>
    `${apiVersion}/stores/products/?store_id=${store_id}&category_slug=${category_slug}`,
  MY_PRODUCTS_PHOTO: (product_id: string) =>
    `${apiVersion}/profile/stores/products/${product_id}/photo/`,
  CATEGORIES: `${apiVersion}/stores/categories/`,
};

export const getMyProductsFromShop = createAsyncThunk(
  `${name}/getMyProductsFromShop`,
  async (
    params: { store_id: string; limit?: number; offset?: number },
    { extra: api }: THUNK_ANY,
  ) => {
    try {
      const response = await api.get(ENDPOINTS.MY_PRODUCTS_FROM_SHOP, { params });
      return {
        store_id: params.store_id,
        data: response.data.results,
        hasMore: !!response.data.next,
      };
    } catch (error) {}
  },
);

export const getProductDetail = createAsyncThunk(
  `${name}/getProductDetail`,
  async (params: { product_id: string }, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(
        ENDPOINTS.MY_PRODUCTS_DETAIL(params.product_id),
        { params },
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getSimilarProducts = createAsyncThunk(
  `${name}/getSimilarProducts`,
  async (params: SimilarProductsQuery, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(
        ENDPOINTS.MY_SIMILAR_PRODUCTS(params.store_id, params.category_slug),
      );
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getCategories = createAsyncThunk(
  `${name}/getCategories`,
  async (_, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data.results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const createProduct = createAsyncThunk(
  `${name}/createProduct`,
  async (payload: ShopData, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.MY_PRODUCTS_FROM_SHOP, payload);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

export const deleteProduct = createAsyncThunk(
  `${name}/deleteProduct`,
  async (
    { productId, storeId }: { productId: string; storeId: string },
    { extra: api }: THUNK_ANY,
  ) => {
    try {
      await api.delete(ENDPOINTS.MY_PRODUCTS_DELETE(productId));
      return { productId, storeId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const editProduct = createAsyncThunk(
  `${name}/editProduct`,
  async (
    payload: { data: ShopData; product_id: string },
    { extra: api }: THUNK_ANY,
  ) => {
    try {
      const response = await api.patch(
        ENDPOINTS.MY_PRODUCT(payload.product_id),
        payload.data,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

export const editProductPin = createAsyncThunk(
  `${name}/editProductPin`,
  async (
    payload: {
      data: {
        is_active?: boolean;
        pin_product?: boolean;
      };
      product_id: string;
    },
    { extra: api }: THUNK_ANY,
  ) => {
    try {
      const response = await api.patch(
        ENDPOINTS.MY_PRODUCT(payload.product_id),
        payload.data,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

export const createPhoto = createAsyncThunk(
  `${name}/createPhoto`,
  async (
    params: { product_id: string; product_photos: Array<File | number> },
    { extra: api }: THUNK_ANY,
  ) => {
    try {
      const formData = new FormData();
      params.product_photos.forEach((item) => {
        formData.append('data', item as unknown as string);
      });
      const response = await api.post(
        ENDPOINTS.MY_PRODUCTS_PHOTO(params.product_id),
        formData,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getMyProduct = createAsyncThunk(
  `${name}/getMyProduct`,
  async (
    params: { product_id: string },
    { extra: api }: { extra?: THUNK_ANY } = {},
  ) => {
    try {
      const response = await api.get(ENDPOINTS.MY_PRODUCT(params.product_id));
      return response.data;
    } catch (err) {
      return [];
    }
  },
);

export const myProductsSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProductById: (state, action) => {
      state.product = action.payload;
    },
    setSimilarProducts: (state, action) => {
      state.similarProducts = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getCategories, {
      status: 'categoriesStatus',
      data: 'categories',
      error: 'categoriesError',
    });
    addQueryCases(builder, getProductDetail, {
      status: 'productStatus',
      data: 'product',
      error: 'productError',
    });
    addQueryCases(builder, getSimilarProducts, {
      status: 'similarProductsStatus',
      data: 'similarProducts',
      error: 'similarProductsError',
    });

    builder
      .addCase(
        getMyProductsFromShop.fulfilled,
        (state: MyProductsState, { payload }) => {
          if (payload) {
            const myProductsData = state.myProductsRecord[ payload.store_id ] ?? {
              hasMore: false,
              products: [],
            };

            myProductsData.hasMore = payload.hasMore;
            myProductsData.products = myProductsData.products
              .concat(payload.data)
              .filter((item, idx, arr) => {
                if (idx !== arr.findLastIndex((elem) => elem.id === item.id))
                  return false;
                return true;
              });
            state.myProductsRecord[ payload.store_id ] = myProductsData;
          }
        },
      )
      .addCase(deleteProduct.fulfilled, () => {
        return initialState;
      });
  },
});

export const { reducer: myProductsReducer } = myProductsSlice;
export const { setCategories } = myProductsSlice.actions;
export const selectMyProducts = (state: RootState) => state.myProducts;
