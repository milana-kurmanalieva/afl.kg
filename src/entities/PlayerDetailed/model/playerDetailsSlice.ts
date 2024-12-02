import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IPlayerState } from '../type/playerSchema';


const name = 'player';

const initialState: IPlayerState = {
  playerDetailed: null,
  playerDetailedStatus: REQUEST_STATUSES.NOT_REQUESTED,
  playerDetailedError: null,
  isPlayerModalOpen: false,
  playerId: null,

  playerStatistics: null,
};

const ENDPOINTS = {
  PLAYER: `/${apiVersion}/players`,
  ARCHIVE_PLAYER: (champId: number, playerId: number) => (
    `${apiVersion}/archive/championships/${champId}/player/${playerId}/statistic`
  ),
};
interface queryParams {
  id: number;
}

interface queryParamsArchive {
  playerId: number;
  champId: number
}

export const getPlayerDetailed = createAsyncThunk(
  `${name}/getPlayerDescription`,
  async (params:queryParams, { extra: api, rejectWithValue }:THUNK_ANY) => {

    try {
      const response = await api.get(`${ENDPOINTS.PLAYER}/${params.id}`, { params });
      return response.data.data;

    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getArchiveStatistics = createAsyncThunk(
  `${name}/getArchiveStatistics`,
  async (params:queryParamsArchive, { extra: api, rejectWithValue }:THUNK_ANY) => {

    try {
      const response = await api.get(ENDPOINTS.ARCHIVE_PLAYER(params.champId, params.playerId), { params });
      return response.data.data;

    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const playerDetailedSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetPlayerDescription: (state) => {
      state.playerDetailed = null;
      state.playerDetailedError = null;
    },
    togglePlayerModal: (state, action) => {
      if (action.payload === undefined) {
        state.isPlayerModalOpen = !state.isPlayerModalOpen;
        return;
      }
      state.isPlayerModalOpen = action.payload;
    },
    setPlayerId: (state, action) => {
      state.playerId = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getPlayerDetailed, {
      status: 'playerDetailedStatus',
      data: 'playerDetailed',
      error: 'playerDetailedError',
    });
    addQueryCases(builder, getArchiveStatistics, {
      status: 'playerDetailedStatus',
      data: 'playerStatistics',
      error: 'playerDetailedError',
    });
  },
});

export const { reducer: playerDetailedReducer } = playerDetailedSlice;
export const { resetPlayerDescription, togglePlayerModal, setPlayerId } = playerDetailedSlice.actions;
export const selectPlayerDetailed = (state:RootState) => state.player;
