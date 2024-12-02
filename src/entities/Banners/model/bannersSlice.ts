import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { BannerState } from '../type/bannerSchema';


const name = 'banner';

const initialState: BannerState = {
  banners: [],
  bannersError: null,
  bannersStatus: REQUEST_STATUSES.NOT_REQUESTED,

  activeBanner: { banner: null, index: 0 },

  mainBanners: [],
  mainBannersError: null,
  mainBannersStatus: REQUEST_STATUSES.NOT_REQUESTED,

  activeMainBanner: { banner: null, index: 0 },
};


const ENDPOINTS = { GET_BANNERS: `${apiVersion}/banners/`, GET_MAIN_BANNERS: `${apiVersion}/main_banners/` };

export const getBanners = createAsyncThunk(
  `${name}/getBanners`,
  async (params, { extra: api, dispatch }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_BANNERS);
      const banners = response.data.results;

      if (banners.length) {
        const randomInitialBanner = Math.floor(Math.random() * banners.length);
        dispatch(setActiveBanner({ banner: banners[ randomInitialBanner ], index: randomInitialBanner }));
      }

      return banners;

    } catch (error) {
      return [];
    }
  },
);


export const getMainBanners = createAsyncThunk(
  `${name}/getMainBanners`,
  async (_, { extra: api, dispatch }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_MAIN_BANNERS);
      const banners = response.data.results;

      if (banners.length) {
        const randomInitialBanner = Math.floor(Math.random() * banners.length);
        dispatch(setActiveMainBanner({ banner: banners[ randomInitialBanner ], index: randomInitialBanner }));
      }

      return banners;

    } catch (error) {
      return [];
    }
  },
);


export const bannersSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setActiveBanner: (state, action) => {
      state.activeBanner = action.payload;
    },
    setActiveMainBanner: (state, action) => {
      state.activeMainBanner = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getBanners, {
      status: 'bannersStatus',
      data: 'banners',
      error: 'bannersError',
    });
    addQueryCases(builder, getMainBanners, {
      status: 'mainBannersStatus',
      data: 'mainBanners',
      error: 'mainBannersError',
    });
  },
});


export const { reducer: bannersReducer } = bannersSlice;
export const { setActiveBanner, setActiveMainBanner } = bannersSlice.actions;
export const selectBanners = (state: RootState) => state.banner;
