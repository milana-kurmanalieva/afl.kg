import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';

import { IChampionShip, IParams } from '../types/archiveChampionsShipScheme';


const name = 'archiveChampionShip';

const initialState: IChampionShip = {
  championshipsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  championshipsList: [],
  tourList: [],
  archiveTable: [],
  archiveBests: null,
  matches: [],
  bombardiers: [],
  rating: [],
  championshipError: null,
  currentArchiveTour: null,
  currentArchiveChampionShip: null,
  championshipsListStatus: REQUEST_STATUSES.NOT_REQUESTED,
  championshipsListError: null,
  ratingError: null,
  ratingStatus: REQUEST_STATUSES.NOT_REQUESTED,
  tourListStatus: REQUEST_STATUSES.NOT_REQUESTED,
  tourListStatusError: null,
  bombardiersError: null,
  bombardiersStatus: REQUEST_STATUSES.NOT_REQUESTED,
  matchesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  matchesError: null,
  archiveBestsError: null,
  archiveBestsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  archiveTableError: null,
  archiveTableStatus: REQUEST_STATUSES.NOT_REQUESTED,

};

export enum IChampionshipVariants {
  TABLE = 'tour_table',
  TOURS = 'tours',
  BESTS = 'bests',
  BOMBARDIERS = '',
  MATCHES = 'matches/',
  RATING = 'players',
}


const ENDPOINTS = {
  GET_CHAMPIONSHIPS:
  (leagueID?: number): string => `${apiVersion}/archive/leagues/${leagueID}/championships`,
  GET_TOURS: (championShipId?: number) => `${apiVersion}/championships/${championShipId}/tours`,
  GET_TABLE: (chamId?: number, divisionId?: number, variant?: IChampionshipVariants, tourId?: number) => {
    const baseEndpoint = `${apiVersion}/archive/championship/${chamId}/division/${divisionId}`;
    return variant === IChampionshipVariants.BOMBARDIERS
      ? `${baseEndpoint}/players?rating=top_scorers`
      : `${baseEndpoint}/${variant}`;
  },
  GET_BESTS: (chamionShipId?: number) => `${apiVersion}/archive/championship/${chamionShipId}/bests`,
  GET_MATCHES: (chamId?: number, divisionId?: number, tourId?: number) =>
    `${apiVersion}/archive/championship/${chamId}/division/${divisionId}/tour/${tourId}/matches`,
};

export const getChampionShips = createAsyncThunk(
  `${name}/getChampionShips`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CHAMPIONSHIPS(params.leagueId));
      return response.data.data.map((item: {id: number; season: string, year: number}) => {
        return { title: `${item.season} ${item.year}`, id: item.id };
      });
    } catch (error) {
      console.error(error);
    }
  },
);

export const getArchiveTours = createAsyncThunk(
  `${name}/getArchiveTours`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_TOURS(params.championShipId));
      const data = response.data.data.map((item: {id: number; number: number}) => {
        return { title: item.number.toString(), id: item.id };
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getArchiveBombardiers = createAsyncThunk(
  `${name}/getArchiveBombardiers`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response =
       await api.get(ENDPOINTS.GET_TABLE(params.chamId, params.divisionId, IChampionshipVariants.BOMBARDIERS));
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getArchiveRating = createAsyncThunk(
  `${name}/getArchiveRating`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response =
       await api.get(ENDPOINTS.GET_TABLE(params.chamId, params.divisionId, IChampionshipVariants.RATING));
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getArchiveTable = createAsyncThunk(
  `${name}/getArchiveTable`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response =
       await api.get(ENDPOINTS.GET_TABLE(params?.chamId, params.divisionId, IChampionshipVariants.TABLE),
       );

      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getArchiveMatches = createAsyncThunk(
  `${name}/getArchiveMatches`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response =
        await api.get(ENDPOINTS.GET_MATCHES(params?.chamId, params.divisionId, params.tourId));
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getArchiveBests = createAsyncThunk(
  `${name}/getArchiveBests`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response =
       await api.get(ENDPOINTS.GET_BESTS(params.chamId));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);
export const archiveChampionShip = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setCurrentArchiveTour(state, action) {
      state.currentArchiveTour = action.payload;
    },
    setCurrentArchiveChampionShip(state, action) {
      state.currentArchiveChampionShip = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getChampionShips, {
      status: 'championshipsListStatus',
      data: 'championshipsList',
      error: 'championshipsListError',
    });
    addQueryCases(builder, getArchiveTours, {
      status: 'tourListStatus',
      data: 'tourList',
      error: 'tourListStatusError',
    });
    addQueryCases(builder, getArchiveTable, {
      status: 'archiveTableStatus',
      data: 'archiveTable',
      error: 'archiveTableError',
    });
    addQueryCases(builder, getArchiveBombardiers, {
      status: 'bombardiersStatus',
      data: 'bombardiers',
      error: 'bombardiersError',
    });
    addQueryCases(builder, getArchiveBests, {
      status: 'archiveBestsStatus',
      data: 'archiveBests',
      error: 'archiveBestsError',
    });
    addQueryCases(builder, getArchiveRating, {
      status: 'championshipsStatus',
      data: 'rating',
      error: 'championshipError',
    });
    addQueryCases(builder, getArchiveMatches, {
      status: 'matchesStatus',
      data: 'matches',
      error: 'matchesError',
    });
  },
});


export const { reducer: archiveChampionShipReducer } = archiveChampionShip;
export const { setCurrentArchiveChampionShip, setCurrentArchiveTour } = archiveChampionShip.actions;
export const selectArchive = (state: RootState) => state.archive;
