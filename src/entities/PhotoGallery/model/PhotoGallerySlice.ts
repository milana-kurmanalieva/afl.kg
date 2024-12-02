import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiVersion, REQUEST_STATUSES, THUNK_ANY } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { PhotoGalleryParams, PhotoGalleryState } from '../type/photoGallerySchema';


const name = 'photoGallery';

const ENDPOINTS = { PHOTO_GALLERY: (id: number) => `/${apiVersion}/leagues/${id}/albums` };

const initialState: PhotoGalleryState = {
  photoGalleryData: { results: [], next: null, count: 0 },
  photoGalleryStatus: REQUEST_STATUSES.NOT_REQUESTED,
  photoGalleryError: null,

};

export const getPhotoGallery = createAsyncThunk(
  `${name}/getPhotoGallery`,
  async (params: PhotoGalleryParams, { extra: api }: {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.PHOTO_GALLERY(params.leagueId), { params });
      return response.data;
    }
    catch (err) {
      console.error(err);
      return [];
    }
  },
);

export const photoGallerySlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setPhotoGalleryData(state, action) {
      state.photoGalleryData = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getPhotoGallery, {
      status: 'photoGalleryStatus',
      data: 'photoGalleryData',
      error: 'photoGalleryError',
      options: { concat: true },
    });
  },
});

export const { reducer: photoGalleryReducer } = photoGallerySlice;
export const { setPhotoGalleryData } = photoGallerySlice.actions;
export const selectPhotoGallery = (state: RootState) => state.photoGallery;
