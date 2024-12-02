import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCookie, setCookie } from 'cookies-next';
import {
  DEFAULT_LEAGUE_ID,
  FilterSelectOption,
  LEAGUES_KEY,
  REQUEST_STATUSES,
  THUNK_ANY,
  apiVersion,
} from '@/shared/lib/constants/constants';
import { RootState } from '@/app/providers/StoreProvider';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { currentLeagueState } from '../type/leagueSchema';


const name = 'currentLeague';

const initialState:currentLeagueState = {
  leagueId: +getCookie(LEAGUES_KEY)! || DEFAULT_LEAGUE_ID,
  currentLeague: { title: '', id: +getCookie(LEAGUES_KEY)! || DEFAULT_LEAGUE_ID, logo: '' },
  leagues: [],
  leaguesStatus: REQUEST_STATUSES.NOT_REQUESTED,
  leaguesError: null,
};


const ENDPOINTS = { GET_LEAGUES: `${apiVersion}/leagues/` };

interface LeagueFromApi {
  name: string;
  id: number;
  logo?: string;
  default: boolean;
}

export const getLeagues = createAsyncThunk(
  `${name}/getLeagues`,
  async (_, { extra: api, dispatch }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.GET_LEAGUES);
      const leaguesList = response.data.results.map((league: LeagueFromApi) => (
        { title: league.name, id: league.id, logo: league.logo, default: league.default }),
      );

      const localLeague = getCookie(LEAGUES_KEY) ?? DEFAULT_LEAGUE_ID;

      const foundLeague = leaguesList.find((league: LeagueFromApi) => league.id === +localLeague);

      if (foundLeague) {
        dispatch(changeLeague(foundLeague));
        setCookie(LEAGUES_KEY, localLeague);
        return leaguesList;
      }

      dispatch(changeLeague(leaguesList[ 0 ]));
      setCookie(LEAGUES_KEY, leaguesList[ 0 ].id);

      return leaguesList;

    } catch (error) {
      console.error(error);
    }
  },
);

export const currentLeagueSlice = createSlice({
  name,
  initialState,
  reducers: {
    changeLeague: (state, action: {payload: FilterSelectOption}) => {
      state.currentLeague = action.payload;
      state.leagueId = action.payload.id;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getLeagues, {
      status: 'leaguesStatus',
      data: 'leagues',
      error: 'leaguesError',
    });
  },
});


export const { actions: currentLeagueActions } = currentLeagueSlice;
export const { reducer: currentLeagueReducer } = currentLeagueSlice;
export const { changeLeague } = currentLeagueSlice.actions;
export const selectCurrentLeague = (state: RootState) => state.currentLeague;
