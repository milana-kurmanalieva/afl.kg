import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import {
  FilterSelectOption,
  REQUEST_STATUSES,
  THUNK_ANY,
  apiVersion,
  getLeagueId,
} from '@/shared/lib/constants/constants';
import {
  DivisionState,
  DivisionOption,
  MatchWithDivision,
  getArchivedDivisionsParams,
  getDivisionMatchesParams,
  getDivisionTableParams,
  getDivisionsParams,
// eslint-disable-next-line import/namespace
} from '../type/divisionSchema';


const name = 'division';

const initialState:DivisionState = {
  divisions: [],
  divisionsError: null,
  divisionsStatus: REQUEST_STATUSES.NOT_REQUESTED,

  currentDivision: {
    id: 0,
    title: '',
    championship_division_archives: [ { original_division_id: 0, title: '' } ],
    championship_tour_archives: [ { original_tour: 0, title: '' } ],
    tour: {
      id: 0,
      number: 0,
      date: '',
    },
  },

  divisionMatches: [],
  divisionMatchesError: null,
  divisionMatchesStatus: REQUEST_STATUSES.NOT_REQUESTED,

  divisionTable: [],
  divisionTableError: null,
  divisionTableStatus: REQUEST_STATUSES.NOT_REQUESTED,

  allDivisionsMatches: [],
  allDivisionsMatchesError: null,
  allDivisionsMatchesStatus: REQUEST_STATUSES.NOT_REQUESTED,

  archivedDivisions: [],
  archivedDivisionsStatus: REQUEST_STATUSES.NOT_REQUESTED,
  currentArchivedDivision: {
    id: 0,
    title: '',
    championship_division_archives: [ { original_division_id: 0, title: '' } ],
    championship_tour_archives: [ { original_tour: 0, title: '' } ],
  },

  bestTourPlayers: [],

  transferredMatches: [],
};

const ENDPOINTS = {
  DIVISIONS: '/divisions/',
  ARCHIVE_DIVISIONS: (leagueID: number) => {
    return `${apiVersion}/archive/leagues/${leagueID}/champ_archives`;
  },
  DIVISION_MATCHES: (tourId: number, divisionId: number) => {
    return `/${apiVersion}/championships/tour/${tourId}/division/${divisionId}/matches`;
  },
  DIVISION_TABLE: (tourId: number, divisionId: number) => {
    return `/${apiVersion}/championships/tour/${tourId}/division/${divisionId}/table`;
  },
  CURRENT_DIVISION_TABLE: (divisionId: number) => {
    return `/${apiVersion}/championships/division/${divisionId}/table`;
  },
  DIVISION_SCHEDULE: (divisionId: number) => {
    return `/${apiVersion}/championships/division/${divisionId}/schedule`;
  },
  TOUR_BEST: (divisionId: number, tour_id?: number) => {
    return `${apiVersion}/championships/division/${divisionId}/tour_best${tour_id ? `?tour_id=${tour_id}` : ''}`;
  },
  TRANSFERRED_MATCHES: (leagueId: number) => `/api/v1/championships/league/${leagueId}/transfered_matches`,
};


export const getDivisions = createAsyncThunk(
  `${name}/getDivisions`,
  async (params:getDivisionsParams, { dispatch, extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await api.get(`/${apiVersion}${getLeagueId(params.leagueId, ENDPOINTS.DIVISIONS)}`);
      const data = response.data.results.map((item: {name: string, id: number, tour: string, prev_tour_id: number}) => {
        return { title: item.name, id: item.id, tour: item.tour, prev_tour_id: item.prev_tour_id };

      });

      if (data[ 0 ]?.id) dispatch(setCurrentDivision(data[ 0 ]));

      return data;

    } catch (err) {
      return [];
    }
  },
);

export const getArchivedDivisions = createAsyncThunk(
  `${name}/getArchivedDivisions`,
  async (params:getArchivedDivisionsParams, { dispatch, extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await api.get(ENDPOINTS.ARCHIVE_DIVISIONS(params.leagueId));

      const data = response.data.results.map((item: {
        title: string,
        championship_tour_archives: [{ original_tour: number, title: string }],
        champ_id: number,
        championship_division_archives: [{original_division_id: number, title: string}]}) => {
        return {
          title: item.title,
          id: item.champ_id,
          championship_division_archives: item.championship_division_archives,
          championship_tour_archives: item.championship_tour_archives,
        };
      });

      if (data[ 0 ]?.id) dispatch(setArchivedCurrentDivision(data[ 0 ]));

      return data;

    } catch (err) {
      return [];
    }
  },
);

export const getDivisionMatches = createAsyncThunk(
  `${name}/getDivisionMatches`,
  async (params:getDivisionMatchesParams, { extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await api.get(
        ENDPOINTS.DIVISION_MATCHES(params.tour_id, params.division_id),
      );

      return response.data.data;

    } catch (err) {
      return [];
    }
  },
);

export const getDivisionTable = createAsyncThunk(
  `${name}/getDivisionTable`,
  async (params:getDivisionTableParams, { extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await api.get(
        ENDPOINTS.DIVISION_TABLE(params.tour_id, params.division_id),
      );

      return response.data.data;

    } catch (err) {
      return [];
    }
  },
);

export const getAllMatches = createAsyncThunk(
  `${name}/getAllMatches`,
  async (params: DivisionOption[], { extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await Promise.all(params.map((query: DivisionOption) => {
        return new Promise((resolve, reject) => {
          try {
            api.get(ENDPOINTS.DIVISION_SCHEDULE(query.id)).then((result: MatchWithDivision) => {
              resolve({
                result,
                division: query,
              });
            });

          } catch (error) {
            reject(error);
          }
        });
      }));

      return response;

    } catch (err) {
      return [];
    }
  },
);

export const getTransferredMatches = createAsyncThunk(
  `${name}/getTransferredMatches`,
  async (params:{id: number}[], { extra: api }: THUNK_ANY = {}) => {
    try {
      const response = await Promise.all(params.map((query: {id: number}) => {
        return new Promise((resolve, reject) => {
          try {
            api.get(ENDPOINTS.TRANSFERRED_MATCHES(query.id))
              .then((result: MatchWithDivision) => {
                resolve({
                  result,
                  division: query,
                });
              }).catch(() => {
                reject([]);
              });

          } catch (error) {
            return [];
          }
        });
      }));

      return response;

    } catch (err) {
      return [];
    }
  },
);

export const getCurrentTable = createAsyncThunk(
  `${name}/getCurrentTable`,
  async (params:{divisionId: number, tourId: number}, { extra: api }: THUNK_ANY = {}) => {

    try {
      const response = await api.get(
        ENDPOINTS.DIVISION_TABLE(params.tourId, params.divisionId),
      );

      return response.data.data;

    } catch (err) {
      return [];
    }
  },
);

export const getTourBest = createAsyncThunk(
  `${name}/getTourBest`,
  async (params:{divisions: any[]}, { extra: api }: THUNK_ANY = {}) => {
    try {
      const res = await Promise.all(params.divisions.map(division => {
        return api.get(ENDPOINTS.TOUR_BEST(division.id, division.prev_tour_id))
          .then((player: any) => player.data.data);
      }));

      return res;
    } catch (err) {
      return [];
    }
  },
);

export const divisionsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setCurrentDivision (state, action) {
      state.currentDivision = action.payload;
    },
    setStatus(state, action) {
      state.divisionsStatus = action.payload;
    },
    setError(state, action) {
      state.divisionsError = action.payload;
    },
    setArchivedCurrentDivision(state, action) {
      state.currentArchivedDivision = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getDivisions, {
      status: 'divisionsStatus',
      data: 'divisions',
      error: 'divisionsError',
    });

    addQueryCases(builder, getArchivedDivisions, {
      status: 'archivedDivisionsStatus',
      data: 'archivedDivisions',
      error: '',
    });


    addQueryCases(builder, getDivisionMatches, {
      status: 'divisionMatchesStatus',
      data: 'divisionMatches',
      error: 'divisionMatchesError',
    });

    addQueryCases(builder, getDivisionTable, {
      status: 'divisionTableStatus',
      data: 'divisionTable',
      error: 'divisionTableError',
    });

    addQueryCases(builder, getCurrentTable, {
      status: 'divisionTableStatus',
      data: 'divisionTable',
      error: 'divisionTableError',
    });

    addQueryCases(builder, getTourBest, {
      status: '',
      data: 'bestTourPlayers',
      error: '',
    });

    addQueryCases(builder, getAllMatches, {
      status: 'allDivisionsMatchesStatus',
      data: 'allDivisionsMatches',
      error: 'allDivisionsMatchesError',
    });

    addQueryCases(builder, getTransferredMatches, {
      status: '',
      data: 'transferredMatches',
      error: '',
    });

    builder.addCase(createAction<{ divisions: DivisionState}>(HYDRATE), (state, action: THUNK_ANY) => {
      if (action.payload?.division?.divisions?.length === 0) return;
      state.divisions = action.payload.division.divisions;
      state.currentDivision = action.payload.division.divisions[ 0 ];
      state.divisionsStatus = action.payload.division.divisionsStatus;
    });
  },
});

export const { reducer: divisionReducer } = divisionsSlice;
export const { setCurrentDivision, setStatus, setError, setArchivedCurrentDivision } = divisionsSlice.actions;
export const selectDivisions = (state: RootState) => state.division;
