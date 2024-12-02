import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { IPollsState } from '../type/pollsSchema';


const name = 'polls';

const initialState:IPollsState = {
  polls: {
    count: 0,
    next: null,
    results: [],
  },
  pollsError: null,
  pollsStatus: REQUEST_STATUSES.NOT_REQUESTED,

  pollsVote: null,
  pollsVoteError: null,
  pollsVoteStatus: REQUEST_STATUSES.NOT_REQUESTED,
};
const ENDPOINTS = {
  POLLS_LIST: (id:number) => (
    `/${apiVersion}/leagues/${id}/polls`
  ),
  POLLS_VOTE: (id:number, poll_pk:number) => (
    `/${apiVersion}/leagues/${id}/polls/${poll_pk}/vote/`
  ),
};

interface pollsListQueryParams {
  page?: number;
  id: number;
}
interface pollsVoteQueryParams {
  id: number;
  poll_pk: number;
  answer_id?: number | string;
}

export const getPollsList = createAsyncThunk(
  `${name}/getPollsList`,
  async (params:pollsListQueryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.POLLS_LIST(params.id), params);
      return response.data;

    } catch (err) {
      return [];
    }
  },
);

export const postPollsVote = createAsyncThunk(
  `${name}/postPollsVote`,
  async (params:pollsVoteQueryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.post(ENDPOINTS.POLLS_VOTE(params.id, params.poll_pk), params);

      return response.data;
    } catch (err:THUNK_ANY) {
      console.error(err?.request?.responseText);

      return [];
    }
  },
);

export const pollsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setPollsStatus: (state, action) => {
      state.pollsStatus = action.payload;
    },
    resetPolls: (state) => {
      state.polls = initialState.polls;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getPollsList, {
      status: 'pollsStatus',
      data: 'polls',
      error: 'pollsError',
      options: { concat: true },
    });
    addQueryCases(builder, postPollsVote, {
      status: 'pollsVoteStatus',
      data: 'pollsVote',
      error: 'pollsVoteError',
      options: { concat: true },
    });
    builder.addCase(createAction<{ polls: IPollsState}>(HYDRATE), (state, action: THUNK_ANY) => {
      if (action.payload.polls === undefined) return;

      state.polls = action.payload.polls.polls;
      state.pollsStatus = action.payload.polls.pollsStatus;
    });
  },
});

export const { reducer: pollsReducer } = pollsSlice;
export const { setPollsStatus, resetPolls } = pollsSlice.actions;
export const selectPolls = (state: RootState) => state.polls;
