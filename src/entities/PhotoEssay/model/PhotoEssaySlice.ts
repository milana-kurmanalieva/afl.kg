import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiVersion, REQUEST_STATUSES, THUNK_ANY } from '@/shared/lib/constants/constants';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { PhotoEssayParams, PhotoEssayState } from '../type/photoEssaySchema';


const name = 'photoEssay';

const ENDPOINTS = { PHOTO_ESSAY: (id: number) => `/${apiVersion}/albums/${id}` };


const initialState: PhotoEssayState = {
  photoEssayData: {
    id: 2,
    title: '',
    date: '2023-04-26',
    description: '',
    images: [],
  },
  photoEssayStatus: REQUEST_STATUSES.NOT_REQUESTED,
  photoEssayError: null,
};

export const getPhotoEssay = createAsyncThunk(
  `${name}/getPhotoEssay`,
  async (params: PhotoEssayParams, { extra: api }: {extra?: THUNK_ANY} = {}) => {
    try {
      const response = await api.get(ENDPOINTS.PHOTO_ESSAY(params.albumId));
      return response.data;

    }
    catch (err) {
      console.error(err);
      return err;
    }
  },
);

export const photoEssaySlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setPhotoEssayData(state, action) {
      state.photoEssayData = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getPhotoEssay, {
      status: 'photoEssayStatus',
      data: 'photoEssayData',
      error: 'photoEssayError',
      options: { concat: false },
    });
  },
});

export const { reducer: photoEssayReducer } = photoEssaySlice;
export const selectPhotoEssay = (state: RootState) => state.photoEssay;
