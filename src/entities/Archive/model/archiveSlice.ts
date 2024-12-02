import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ca } from 'date-fns/locale';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { FilterSelectOption, REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IArchiveState, IParams } from '../type/arciveSliceScheme';


const name = 'archive';

const initialState: IArchiveState = {
  archiveStatus: REQUEST_STATUSES.NOT_REQUESTED,
  cupsListStatus: REQUEST_STATUSES.NOT_REQUESTED,
  cupReadStatus: REQUEST_STATUSES.NOT_REQUESTED,
  placesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  cupsList: [],
  matchesCups: [],
  cupsRead: null,
  places: null,
  currentCup: null,
  archiveError: null,
  cupsListError: null,
  cupReadError: null,
  currentCupError: null,
  winners: null,
  players: null,
  filterSuperCup: null,
  filterSuperCupList: null,
  divisionSelect: null,
  divisionFilterList: null,
};


const ENDPOINTS = {
  GET_CUPS:
  (leagueID: number): string => `${apiVersion}/archive/leagues/${leagueID}/cup_archives/`,
  GET_CUP: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/the_bests`,
  GET_PLACES: (cupId?: number) => `${apiVersion}/archive/cups/${cupId}/places`,
  GET_WINNERS: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/top_three_teams`,
  GET_PLAYERS: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/cup_players`,
  GET_MATCHES: (cupId?: number) => `${apiVersion}/archive/cup/${cupId}/cup_matches/`,
};


export const getCups = createAsyncThunk(
  `${name}/getCups`,
  async (params: number, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_CUPS(params));

      return response.data.results;

    } catch (error) {
      console.error(error);
    }
  },
);


export const getWinners = createAsyncThunk(
  `${name}/getWinners`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const superCupParam = params?.super_cup ? `&super_cup=${params.super_cup}` : '';
      const response = await api.get(`${ENDPOINTS.GET_WINNERS(params?.currentCup)}?${superCupParam}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getMatchesCup = createAsyncThunk(
  `${name}/getMatchesCup`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const queryParams = params?.is_super_cup ? { super_cup: 1 } : {};

      const response = await api.get(ENDPOINTS.GET_MATCHES(params?.currentCup), { params: queryParams });
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getPlayers = createAsyncThunk(
  `${name}/getPlayers`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_PLAYERS(params?.currentCup));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);


export const getCup = createAsyncThunk(
  `${name}/getCup`,
  async (params: any, { extra: api }: THUNK_ANY) => {
    try {
      const superCupParam = params?.super_cup ? `&super_cup=${params.super_cup}` : '';
      const response = await api.get(`${ENDPOINTS.GET_CUP(params?.currentCup)}?${superCupParam}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getPlaces = createAsyncThunk(
  `${name}/getPlaces`,
  async (params: IParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_PLACES(params?.currentCup));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);


export const archiveSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setCurrentCupArchive(state, action) {
      state.currentCup = action.payload;
    },
    setFilterSuerCup(state, action) {
      state.filterSuperCup = action.payload;
    },
    setFilterSuerCupList(state, action) {
      state.filterSuperCupList = action.payload;
    },
    setDivisionSelect(state, action) {
      state.divisionSelect = action.payload;
    },
    setDivisionFilterList(state, action) {
      state.divisionFilterList = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getCups, {
      status: 'cupsListStatus',
      data: 'cupsList',
      error: 'cupsListError',
    });
    addQueryCases(builder, getCup, {
      status: 'archiveStatus',
      data: 'cupsRead',
      error: 'archiveError',
    });
    addQueryCases(builder, getPlaces, {
      status: 'cupReadStatus',
      data: 'places',
      error: 'cupReadError',
    });
    addQueryCases(builder, getWinners, {
      status: 'cupReadStatus',
      data: 'winners',
      error: 'cupReadError',
    });
    addQueryCases(builder, getPlayers, {
      status: 'cupReadStatus',
      data: 'players',
      error: 'cupReadError',
    });
    addQueryCases(builder, getMatchesCup, {
      status: 'matchesCupsStatus',
      data: 'matchesCups',
      error: 'matchesCupsError',
    });
  },
});


export const { reducer: archiveReducer } = archiveSlice;
export const {
  setCurrentCupArchive,
  setFilterSuerCup,
  setFilterSuerCupList,
  setDivisionSelect,
  setDivisionFilterList,
} = archiveSlice.actions;
export const selectArchive = (state: RootState) => state.archive;
