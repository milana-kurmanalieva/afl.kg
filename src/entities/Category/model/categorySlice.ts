// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { addQueryCases } from '@/shared/lib/helpers/helpers';
// import { RootState } from '@/app/providers/StoreProvider';
// import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
// import { CategoryState } from '../type/categorySchema';
//
//
// const name = 'categories';
//
// const initialState: CategoryState = {
//   categories: {
//     count: 0,
//     next: null,
//     previous: null,
//     results: [],
//   },
//   categoriesError: null,
//   categoriesStatus: REQUEST_STATUSES.NOT_REQUESTED,
// };
//
//
// interface queryParamsCategories {
//   limit?: number;
//   offset?:number;
//   fields_count?: number | string;
//   price_from?:number | string;
//   price_to?:number | string;
// }
//
// interface queryParamsId {
//   id: string;
// }
//
// const ENDPOINTS = {
//   STORES: () => (
//     `/${apiVersion}/stores/`
//   ),
//   STORE: (id: string) => (
//     `/${apiVersion}/stores/${id}`
//   ),
// };
//
//
// // export const getStores = createAsyncThunk(
// //   `${name}/getStores`,
// //   async (params?:queryParamsCategories, { extra: api }: { extra?: THUNK_ANY } = {}) => {
// //     try {
// //       const response = await api.get(ENDPOINTS.STORES(), { params });
// //       return response.data;
// //     } catch (err) {
// //       return [];
// //     }
// //   },
// // );
// //
// // export const getStore = createAsyncThunk(
// //   `${name}/getStore`,
// //   async (params:queryParamsId, { extra: api }: { extra?: THUNK_ANY } = {}) => {
// //     try {
// //       const response = await api.get(ENDPOINTS.STORE(params?.id));
// //       return response.data;
// //     } catch (err) {
// //       return [];
// //     }
// //   },
// // );
//
//
// export const storesSlice = createSlice({
//   name: name,
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     addQueryCases(builder, getStores, {
//       status: 'storesStatus',
//       data: 'stores',
//       error: 'storesError',
//       options: { concat: true },
//     });
//     addQueryCases(builder, getStore, {
//       status: 'storeStatus',
//       data: 'store',
//       error: 'storeError',
//     });
//   },
// });
//
// export const { reducer: storesReducer } = storesSlice;
// export const selectStores = (state: RootState) => {
//   return state.stores;
// };
